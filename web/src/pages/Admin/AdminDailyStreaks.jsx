import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { MOCK_ADMIN_DAILY_STREAKS, ADMIN_DAILY_STREAK_PRIMARY_KEY } from '@/constants';
import { createColumnHelper } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/data-table';
import AdminActionButton from '@/components/admin/AdminActionButton';
import DailyStreakFormDialog from '@/components/admin/DailyStreakFormDialog';
import { useToast } from '@/hooks/use-toast';
import { fetchAdminDailyStreaks, updateAdminDailyStreak, createAdminDailyStreak, deleteAdminDailyStreak } from '@/api';

const columnHelper = createColumnHelper();

export default function AdminDailyStreaks() {
  const { toast } = useToast();
  const [rows, setRows] = useState(() => []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeRecord, setActiveRecord] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const list = await fetchAdminDailyStreaks();
      if (Array.isArray(list) && list.length) setRows(list);
    } catch (err) {
      setError(err?.message || 'Failed to load daily streaks');
      toast.error('Failed to load daily streaks');
    } finally { setLoading(false); }
  }, [toast]);

  useEffect(() => { loadData(); }, [loadData]);

  const data = useMemo(() => rows, [rows]);

  const handleSave = useCallback(async (updated) => {
    const pk = ADMIN_DAILY_STREAK_PRIMARY_KEY;
    try {
      if (updated[pk]) {
        await updateAdminDailyStreak(updated[pk], updated);
        toast.success('Daily streak updated successfully.');
      } else {
        await createAdminDailyStreak({ ...updated });
        toast.success('Daily streak created successfully.');
      }
      await loadData();
    } catch (err) {
      toast.error(err?.message || 'Failed to save record');
      throw err;
    }
  }, [loadData, toast]);

  const columns = useMemo(() => [
    // columnHelper.accessor('user', { header: 'User ID', sortingFn: 'alphanumeric' }),
    columnHelper.accessor('username', { header: 'Username', sortingFn: 'alphanumeric' }),
    columnHelper.accessor('daily_streak_date', { header: 'Date', sortingFn: 'alphanumeric' }),
    columnHelper.accessor('is_streak_saver', { header: 'Streak Saver Used', cell: info => info.getValue() ? 'Yes' : 'No', sortingFn: 'alphanumeric' }),
    columnHelper.display({
      id: 'actions', header: 'Actions', cell: info => {
        const record = info.row.original;
        return (
          <div className="flex gap-1">
            {/* <AdminActionButton variant="outline" onClick={() => setActiveRecord(record)}>Modify</AdminActionButton> */}
            <AdminActionButton variant="destructive" onClick={async () => {
              if (!record.daily_streak_id) return;
              if (!window.confirm('Delete this daily streak record?')) return;
              try {
                await deleteAdminDailyStreak(record.daily_streak_id);
                toast.success('Daily streak deleted.');
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
        <h2 className="text-2xl font-semibold">Daily Streaks</h2>
        <div>
          <button
            className="inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium transition-colors hover:bg-neutral-800 bg-neutral-900 text-neutral-100 border border-neutral-800 hover:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            onClick={() => setActiveRecord({
              daily_streak_id: undefined,
              user_id: '',
              username: '',
              daily_streak_date: '',
              is_streak_saver: false,
            })}
          >Create Daily Streak</button>
        </div>
      </header>
      <section>
        <div className="rounded border border-neutral-800 bg-neutral-950/30 p-0">
          {error && <div className="p-3 text-sm text-destructive border-b border-destructive/30 bg-destructive/5">{error}</div>}
          {loading ? <div className="p-6 text-sm text-neutral-400">Loading daily streaks...</div> : <DataTable columns={columns} data={data} />}
        </div>
      </section>
      <DailyStreakFormDialog
        open={!!activeRecord}
        onOpenChange={(o) => { if (!o) setActiveRecord(null); }}
        record={activeRecord}
        onSave={handleSave}
      />
    </div>
  );
}
