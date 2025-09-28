import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/data-table';
import AdminActionButton from '@/components/admin/AdminActionButton';
import { useToast } from '@/hooks/use-toast';
import { 
  fetchAdminUserCourses,
  updateAdminUserCourse,
  createAdminUserCourse,
  deleteAdminUserCourse,
} from '@/api';
import { MOCK_ADMIN_USER_COURSES, ADMIN_USER_COURSE_PRIMARY_KEY } from '@/constants';
import UserCourseFormDialog from '@/components/admin/UserCourseFormDialog';
import { formatDateTime } from '@/lib/datetime';

const columnHelper = createColumnHelper();

export default function AdminUserCourses() {
  const { toast } = useToast();
  const [rows, setRows] = useState(() => MOCK_ADMIN_USER_COURSES);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeRecord, setActiveRecord] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const list = await fetchAdminUserCourses();
      if (Array.isArray(list) && list.length) setRows(list);
    } catch (err) {
      setError(err?.message || 'Failed to load user courses');
      toast.error('Failed to load user courses');
    } finally { setLoading(false); }
  }, [toast]);

  useEffect(() => { loadData(); }, [loadData]);

  const data = useMemo(() => rows, [rows]);

  const handleSave = useCallback(async (updated) => {
    const pk = ADMIN_USER_COURSE_PRIMARY_KEY;
    try {
      if (updated[pk]) {
        await updateAdminUserCourse(updated[pk], updated);
        toast.success('User course updated successfully.');
      } else {
        const payload = { ...updated };
        await createAdminUserCourse(payload);
        toast.success('User course created successfully.');
      }
      await loadData();
    } catch (err) {
      toast.error(err?.message || 'Failed to save record');
      throw err;
    }
  }, [loadData, toast]);

  const columns = useMemo(() => [
    columnHelper.accessor('user_course_id', { header: 'ID', sortingFn: 'alphanumeric' }),
    columnHelper.accessor('user', { header: 'User ID', sortingFn: 'alphanumeric' }),
    columnHelper.accessor('username', { header: 'Username', sortingFn: 'alphanumeric' }),
    columnHelper.accessor('course', { header: 'Course ID', sortingFn: 'alphanumeric' }),
    columnHelper.accessor('course_title', { header: 'Course Title', sortingFn: 'alphanumeric' }),
    columnHelper.accessor('enrollment_date', {
      header: 'Enrollment Date',
      cell: info => <span className="text-neutral-300">{formatDateTime(info.getValue()) || '—'}</span>,
      sortingFn: (a,b,id) => {
        const va = a.getValue(id); const vb = b.getValue(id);
        const ta = va ? Date.parse(va) : 0; const tb = vb ? Date.parse(vb) : 0;
        return ta === tb ? 0 : ta > tb ? 1 : -1;
      }
    }),
    columnHelper.accessor('is_dropped', {
      header: 'Dropped?',
      cell: info => <span className="inline-flex items-center rounded px-2 py-0.5 text-xs border border-neutral-700 bg-neutral-900">{info.getValue() ? 'Yes' : 'No'}</span>,
      sortingFn: 'alphanumeric'
    }),
    columnHelper.display({
      id: 'actions', header: 'Actions', cell: info => {
        const record = info.row.original;
        return (
          <div className="flex gap-1">
            <AdminActionButton variant="outline" onClick={() => setActiveRecord(record)}>Modify</AdminActionButton>
            <AdminActionButton variant="destructive" onClick={async () => {
              if (!record.user_course_id) return;
              if (!window.confirm('Delete this user course record?')) return;
              try {
                await deleteAdminUserCourse(record.user_course_id);
                toast.success('User course deleted.');
                await loadData();
              } catch (err) {
                toast.error(err?.message || 'Failed to delete record');
              }
            }}>Delete</AdminActionButton>
          </div>
        );
      }, enableSorting: false
    })
  ], [loadData, toast]);

  return (
    <div className="space-y-10">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="text-2xl font-semibold">User Courses</h2>
        <div>
          <button
            className="inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium transition-colors hover:bg-neutral-800 bg-neutral-900 text-neutral-100 border border-neutral-800 hover:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            onClick={() => setActiveRecord({
              user_course_id: undefined,
              user_id: '',
              username: '',
              course_id: '',
              course_title: '',
              enrollment_date: '',
              is_dropped: false,
            })}
          >Create User Course</button>
        </div>
      </header>
      <section>
        <div className="rounded border border-neutral-800 bg-neutral-950/30 p-0">
          {error && <div className="p-3 text-sm text-destructive border-b border-destructive/30 bg-destructive/5">{error}</div>}
          {loading ? <div className="p-6 text-sm text-neutral-400">Loading user courses...</div> : <DataTable columns={columns} data={data} />}
        </div>
      </section>
      <UserCourseFormDialog
        open={!!activeRecord}
        onOpenChange={(o) => { if (!o) setActiveRecord(null); }}
        record={activeRecord}
        onSave={handleSave}
      />
    </div>
  );
}
