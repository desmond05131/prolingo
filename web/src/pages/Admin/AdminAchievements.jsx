import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { MOCK_ADMIN_ACHIEVEMENTS, ADMIN_ACHIEVEMENT_PRIMARY_KEY } from '@/constants';
import { DataTable } from '@/components/ui/data-table';
import { createColumnHelper } from '@tanstack/react-table';
import AdminActionButton from '@/components/admin/AdminActionButton';
import AchievementFormDialog from '@/components/admin/AchievementFormDialog';
import { fetchAdminAchievements, updateAdminAchievement, createAdminAchievement, deleteAdminAchievement } from '@/api';
import { useToast } from '@/hooks/use-toast';

const columnHelper = createColumnHelper();

export default function AdminAchievements() {
  const { toast } = useToast();
  const [rows, setRows] = useState(() => []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await fetchAdminAchievements();
      if (Array.isArray(list) && list.length) setRows(list);
    } catch (err) {
      setError(err?.message || 'Failed to load achievements');
      toast.error('Failed to load achievements');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { loadData(); }, [loadData]);

  const [activeRecord, setActiveRecord] = useState(null);
  const data = useMemo(() => rows, [rows]);

  const handleSave = useCallback(async (updated) => {
    const pk = ADMIN_ACHIEVEMENT_PRIMARY_KEY;
    try {
      if (updated[pk]) {
        await updateAdminAchievement(updated[pk], updated);
        toast.success('Achievement updated successfully.');
      } else {
        const payload = { ...updated };
        await createAdminAchievement(payload);
        toast.success('Achievement created successfully.');
      }
      await loadData();
    } catch (err) {
      toast.error(err?.message || 'Failed to save achievement');
      throw err;
    }
  }, [loadData, toast]);

  const columns = useMemo(() => [
    columnHelper.accessor('achievement_id', { header: 'ID', cell: info => <span className="font-medium text-neutral-100">{info.getValue()}</span>, sortingFn: 'alphanumeric' }),
    columnHelper.accessor('target_xp_value', { header: 'Target XP', cell: info => info.getValue() ?? '—', sortingFn: 'alphanumeric' }),
    columnHelper.accessor('target_streak_value', { header: 'Target Streak', cell: info => info.getValue() ?? '—', sortingFn: 'alphanumeric' }),
    columnHelper.accessor('target_completed_test_id', { header: 'Target Test', cell: info => info.getValue() ?? '—', sortingFn: 'alphanumeric' }),
    columnHelper.accessor('reward_type', { header: 'Reward Type', sortingFn: 'alphanumeric', cell: info => <span className="capitalize">{info.getValue()}</span> }),
    columnHelper.accessor('reward_amount', { header: 'Reward Amt', cell: info => info.getValue() ?? '—', sortingFn: 'alphanumeric' }),
    columnHelper.accessor('reward_content', { header: 'Content / Badge', cell: info => info.getValue() ?? '—', sortingFn: 'alphanumeric' }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: info => {
        const record = info.row.original;
        return (
          <div className="flex gap-1">
            <AdminActionButton variant="outline" onClick={() => setActiveRecord(record)}>Modify</AdminActionButton>
            <AdminActionButton variant="destructive" onClick={async () => {
              const id = record.achievement_id;
              if (!id) return;
              if (!window.confirm('Delete this achievement? This cannot be undone.')) return;
              try {
                await deleteAdminAchievement(id);
                toast.success('Achievement deleted.');
                await loadData();
              } catch (err) {
                toast.error(err?.message || 'Failed to delete achievement');
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
        <h2 className="text-2xl font-semibold">Achievements</h2>
        <div className="flex flex-col gap-2 sm:items-end sm:text-right">
          <button
            className="inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium transition-colors hover:bg-neutral-800 bg-neutral-900 text-neutral-100 border border-neutral-800 hover:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            onClick={() => setActiveRecord({
              achievement_id: undefined,
              target_xp_value: '',
              target_streak_value: '',
              target_completed_test_id: '',
              reward_type: 'xp',
              reward_amount: '',
              reward_content: '',
              reward_content_description: ''
            })}
          >Create New Achievement</button>
        </div>
      </header>

      <section className="space-y-4">
        <div className="rounded border border-neutral-800 bg-neutral-950/30 p-0">
          {error && (
            <div className="p-3 text-sm text-destructive border-b border-destructive/30 bg-destructive/5">{error}</div>
          )}
          {loading ? (
            <div className="p-6 text-sm text-neutral-400">Loading achievements...</div>
          ) : (
            <DataTable columns={columns} data={data} />
          )}
        </div>
      </section>
      <AchievementFormDialog
        open={!!activeRecord}
        onOpenChange={(o) => { if (!o) setActiveRecord(null); }}
        record={activeRecord}
        onSave={handleSave}
      />
    </div>
  );
}
