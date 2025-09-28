import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/data-table';
import AdminActionButton from '@/components/admin/AdminActionButton';
import { useToast } from '@/hooks/use-toast';
import { 
  fetchAdminUserTests,
  updateAdminUserTest,
  createAdminUserTest,
  deleteAdminUserTest,
  fetchAdminUserTestAnswers,
  updateAdminUserTestAnswer,
  createAdminUserTestAnswer,
  deleteAdminUserTestAnswer,
} from '@/api';
import { MOCK_ADMIN_USER_TESTS, ADMIN_USER_TEST_PRIMARY_KEY, MOCK_ADMIN_USER_TEST_ANSWERS, ADMIN_USER_TEST_ANSWER_PRIMARY_KEY } from '@/constants';
import UserTestFormDialog from '@/components/admin/UserTestFormDialog';
import UserTestAnswerFormDialog from '@/components/admin/UserTestAnswerFormDialog';
import { formatDateTime } from '@/lib/datetime';

const columnHelper = createColumnHelper();

export default function AdminUserTests() {
  const { toast } = useToast();
  const [rows, setRows] = useState(() => MOCK_ADMIN_USER_TESTS);
  const [answersByTest, setAnswersByTest] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeRecord, setActiveRecord] = useState(null);
  const [activeAnswerRecord, setActiveAnswerRecord] = useState(null);
  const [parentTestIdForAnswer, setParentTestIdForAnswer] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const list = await fetchAdminUserTests();
      if (Array.isArray(list) && list.length) setRows(list);
    } catch (err) {
      setError(err?.message || 'Failed to load user tests');
      toast.error('Failed to load user tests');
    } finally { setLoading(false); }
  }, [toast]);

  useEffect(() => { loadData(); }, [loadData]);

  const data = useMemo(() => rows, [rows]);

  const loadAnswers = useCallback(async (user_test_id) => {
    try {
      const list = await fetchAdminUserTestAnswers(user_test_id);
      setAnswersByTest(prev => ({ ...prev, [user_test_id]: list }));
    } catch (err) {
      // fall back to mock during dev if api fails
      const fallback = MOCK_ADMIN_USER_TEST_ANSWERS.filter(a => a.user_test_id === user_test_id);
      setAnswersByTest(prev => ({ ...prev, [user_test_id]: fallback }));
    }
  }, []);

  const handleSaveTest = useCallback(async (updated) => {
    const pk = ADMIN_USER_TEST_PRIMARY_KEY;
    try {
      if (updated[pk]) {
        await updateAdminUserTest(updated[pk], updated);
        toast.success('User test updated successfully.');
      } else {
        const payload = { ...updated };
        await createAdminUserTest(payload);
        toast.success('User test created successfully.');
      }
      await loadData();
    } catch (err) {
      toast.error(err?.message || 'Failed to save record');
      throw err;
    }
  }, [loadData, toast]);

  const handleSaveAnswer = useCallback(async (updated) => {
    const pk = ADMIN_USER_TEST_ANSWER_PRIMARY_KEY;
    try {
      if (updated[pk]) {
        await updateAdminUserTestAnswer(updated[pk], updated);
        toast.success('Answer updated successfully.');
      } else {
        const payload = { ...updated };
        await createAdminUserTestAnswer(payload);
        toast.success('Answer created successfully.');
      }
      if (updated.user_test_id) await loadAnswers(updated.user_test_id);
    } catch (err) {
      toast.error(err?.message || 'Failed to save answer');
      throw err;
    }
  }, [loadAnswers, toast]);

  const renderAnswersTable = useCallback((user_test_id) => {
    const answers = answersByTest[user_test_id];
    const cols = [
      columnHelper.accessor('given_answer_text', { header: 'Answer', sortingFn: 'alphanumeric' }),
      columnHelper.accessor('is_correct', { header: 'Correct?', cell: info => <span className="inline-flex items-center rounded px-2 py-0.5 text-xs border border-neutral-700 bg-neutral-900">{info.getValue() ? 'Yes' : 'No'}</span> }),
      columnHelper.display({
        id: 'ans_actions', header: 'Actions', cell: info => {
          const record = info.row.original;
          return (
            <div className="flex gap-1">
              <AdminActionButton variant="outline" onClick={() => setActiveAnswerRecord(record)}>Modify</AdminActionButton>
              <AdminActionButton variant="destructive" onClick={async () => {
                if (!record.user_test_answer_id) return;
                if (!window.confirm('Delete this answer?')) return;
                try {
                  await deleteAdminUserTestAnswer(record.user_test_answer_id);
                  toast.success('Answer deleted.');
                  await loadAnswers(user_test_id);
                } catch (err) {
                  toast.error(err?.message || 'Failed to delete answer');
                }
              }}>Delete</AdminActionButton>
            </div>
          );
        }, enableSorting: false
      })
    ];

    return (
      <div className="rounded border border-neutral-800 bg-neutral-950/50 p-3 mt-3">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-semibold">Answers</h4>
          <AdminActionButton onClick={() => { setParentTestIdForAnswer(user_test_id); setActiveAnswerRecord({ user_test_answer_id: undefined, user_test_id, given_answer_text: '', is_correct: false }); }}>Add Answer</AdminActionButton>
        </div>
        {!answers ? (
          <div className="p-3 text-sm text-neutral-400">No answers loaded.</div>
        ) : (
          <DataTable columns={cols} data={answers} />
        )}
      </div>
    );
  }, [answersByTest, toast, loadAnswers]);

  const columns = useMemo(() => [
    columnHelper.accessor('user_test_id', { header: 'ID', sortingFn: 'alphanumeric' }),
    columnHelper.accessor('user', { header: 'User ID', sortingFn: 'alphanumeric' }),
    columnHelper.accessor('username', { header: 'Username', sortingFn: 'alphanumeric' }),
    columnHelper.accessor('test', { header: 'Test ID', sortingFn: 'alphanumeric' }),
    columnHelper.accessor('test_title', { header: 'Test Title', sortingFn: 'alphanumeric' }),
    columnHelper.accessor('attempt_date', {
      header: 'Attempted At',
      cell: info => <span className="text-neutral-300">{info.getValue() ? formatDateTime(info.getValue()) : '—'}</span>,
      sortingFn: (a,b,id) => {
        const va = a.getValue(id); const vb = b.getValue(id);
        const ta = va ? Date.parse(va) : 0; const tb = vb ? Date.parse(vb) : 0;
        return ta === tb ? 0 : ta > tb ? 1 : -1;
      }
    }),
    columnHelper.accessor('time_spent', { header: 'Time Spent (s)', sortingFn: 'alphanumeric' }),
    columnHelper.display({
      id: 'answers', header: 'User Answers', cell: info => {
        const record = info.row.original;
        return (
          <div className="flex flex-col">
            <AdminActionButton onClick={async () => { await loadAnswers(record.user_test_id); }}>Load Answers</AdminActionButton>
            {answersByTest[record.user_test_id] && renderAnswersTable(record.user_test_id)}
          </div>
        );
      }, enableSorting: false
    }),
    columnHelper.display({
      id: 'actions', header: 'Actions', cell: info => {
        const record = info.row.original;
        return (
          <div className="flex gap-1">
            <AdminActionButton variant="outline" onClick={() => setActiveRecord(record)}>Modify</AdminActionButton>
            <AdminActionButton variant="destructive" onClick={async () => {
              if (!record.user_test_id) return;
              if (!window.confirm('Delete this user test record?')) return;
              try {
                await deleteAdminUserTest(record.user_test_id);
                toast.success('User test deleted.');
                await loadData();
              } catch (err) {
                toast.error(err?.message || 'Failed to delete record');
              }
            }}>Delete</AdminActionButton>
          </div>
        );
      }, enableSorting: false
    })
  ], [answersByTest, loadAnswers, loadData, toast, renderAnswersTable]);

  return (
    <div className="space-y-10">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="text-2xl font-semibold">User Tests</h2>
        <div>
          <button
            className="inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium transition-colors hover:bg-neutral-800 bg-neutral-900 text-neutral-100 border border-neutral-800 hover:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            onClick={() => setActiveRecord({
              user_test_id: undefined,
              user_id: '',
              username: '',
              test_id: '',
              test_title: '',
              attempt_date: '',
              time_spent: 0,
            })}
          >Create User Test</button>
        </div>
      </header>
      <section>
        <div className="rounded border border-neutral-800 bg-neutral-950/30 p-0">
          {error && <div className="p-3 text-sm text-destructive border-b border-destructive/30 bg-destructive/5">{error}</div>}
          {loading ? <div className="p-6 text-sm text-neutral-400">Loading user tests...</div> : <DataTable columns={columns} data={data} />}
        </div>
      </section>
      <UserTestFormDialog
        open={!!activeRecord}
        onOpenChange={(o) => { if (!o) setActiveRecord(null); }}
        record={activeRecord}
        onSave={handleSaveTest}
      />
      <UserTestAnswerFormDialog
        open={!!activeAnswerRecord}
        onOpenChange={(o) => { if (!o) { setActiveAnswerRecord(null); setParentTestIdForAnswer(null); } }}
        record={activeAnswerRecord}
        parentTestId={parentTestIdForAnswer}
        onSave={handleSaveAnswer}
      />
    </div>
  );
}
