import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { MOCK_ADMIN_FEEDBACK, ADMIN_FEEDBACK_PRIMARY_KEY } from '@/constants';
import { DataTable } from '@/components/ui/data-table';
import { createColumnHelper } from '@tanstack/react-table';
import AdminActionButton from '@/components/admin/AdminActionButton';
import FeedbackFormDialog from '@/components/admin/FeedbackFormDialog';
import { fetchAdminFeedback, createAdminFeedback, updateAdminFeedback, deleteAdminFeedback } from '@/api';
import { useToast } from '@/hooks/use-toast';

const columnHelper = createColumnHelper();

export default function AdminFeedback() {
  const { toast } = useToast();
  const [rows, setRows] = useState(() => []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeRecord, setActiveRecord] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await fetchAdminFeedback();
      if (Array.isArray(list) && list.length) {
        setRows(list);
      }
    } catch (err) {
      setError(err?.message || 'Failed to load feedback');
      toast.error('Failed to load feedback');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { loadData(); }, [loadData]);

  const data = useMemo(() => rows, [rows]);

  const handleSave = useCallback(async (updated) => {
    const pk = ADMIN_FEEDBACK_PRIMARY_KEY;
    try {
      if (updated[pk]) {
        await updateAdminFeedback(updated[pk], updated);
        toast.success('Feedback updated successfully.');
      } else {
        const payload = { ...updated };
        await createAdminFeedback(payload);
        toast.success('Feedback created successfully.');
      }
      await loadData();
    } catch (err) {
      toast.error(err?.message || 'Failed to save feedback');
      throw err;
    }
  }, [loadData, toast]);

  const columns = useMemo(() => [
    columnHelper.accessor('feedback_id', {
      header: 'ID',
      cell: info => <span className="text-neutral-400 text-xs">{info.getValue()}</span>,
      enableSorting: true,
    }),
    columnHelper.accessor('message', {
      header: 'Message',
      cell: info => {
        const val = info.getValue();
        return <span className="text-neutral-100">{val && val.length > 80 ? `${val.slice(0,80)}…` : val}</span>;
      },
      sortingFn: 'alphanumeric',
    }),
    columnHelper.accessor('created_by', {
      header: 'Created By',
      cell: info => <span className="font-medium text-neutral-100">{info.getValue()}</span>,
      sortingFn: 'alphanumeric',
    }),
    columnHelper.accessor('created_date', {
      header: 'Created Date',
      cell: info => <span className="text-neutral-300">{info.getValue() ? new Date(info.getValue()).toLocaleString() : '—'}</span>,
      sortingFn: (a, b, id) => {
        const av = Date.parse(a.getValue(id) || 0);
        const bv = Date.parse(b.getValue(id) || 0);
        return av === bv ? 0 : av > bv ? 1 : -1;
      }
    }),
    columnHelper.accessor('updated_by', {
      header: 'Updated By',
      cell: info => <span className="text-neutral-300">{info.getValue() || '—'}</span>,
      sortingFn: 'alphanumeric',
    }),
    columnHelper.accessor('updated_date', {
      header: 'Updated Date',
      cell: info => <span className="text-neutral-300">{info.getValue() ? new Date(info.getValue()).toLocaleString() : '—'}</span>,
      sortingFn: (a, b, id) => {
        const av = Date.parse(a.getValue(id) || 0);
        const bv = Date.parse(b.getValue(id) || 0);
        return av === bv ? 0 : av > bv ? 1 : -1;
      }
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: info => {
        const record = info.row.original;
        return (
          <div className="flex gap-1">
            <AdminActionButton onClick={() => setActiveRecord(record)}>View</AdminActionButton>
            <AdminActionButton variant="outline" onClick={() => setActiveRecord(record)}>Edit</AdminActionButton>
            <AdminActionButton variant="destructive" onClick={async () => {
              if (!record.feedback_id) return;
              if (!window.confirm('Delete this feedback entry? This cannot be undone.')) return;
              try {
                await deleteAdminFeedback(record.feedback_id);
                toast.success('Feedback deleted.');
                await loadData();
              } catch (err) {
                toast.error(err?.message || 'Failed to delete feedback');
              }
            }}>Delete</AdminActionButton>
          </div>
        );
      },
      enableSorting: false,
    }),
  ], [loadData, toast]);

  return (
    <div className="space-y-10">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="text-2xl font-semibold">Feedback</h2>
        <div className="flex flex-col gap-2 sm:items-end sm:text-right">
          <button
            className="inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium transition-colors hover:bg-neutral-800 bg-neutral-900 text-neutral-100 border border-neutral-800 hover:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            onClick={() => setActiveRecord({
              feedback_id: undefined,
              message: '',
              created_by: '',
              created_date: new Date().toISOString(),
              updated_by: null,
              updated_date: null,
            })}
          >Create New Feedback</button>
        </div>
      </header>

      <section className="space-y-4">
        <div className="rounded border border-neutral-800 bg-neutral-950/30 p-0">
          {error && (
            <div className="p-3 text-sm text-destructive border-b border-destructive/30 bg-destructive/5">{error}</div>
          )}
          {loading ? (
            <div className="p-6 text-sm text-neutral-400">Loading feedback...</div>
          ) : (
            <DataTable columns={columns} data={data} />
          )}
        </div>
      </section>
      <FeedbackFormDialog
        open={!!activeRecord}
        onOpenChange={(o) => { if (!o) setActiveRecord(null); }}
        record={activeRecord}
        onSave={handleSave}
      />
    </div>
  );
}
