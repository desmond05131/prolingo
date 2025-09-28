import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/data-table';
import AdminActionButton from '@/components/admin/AdminActionButton';
import UserClaimedAchievementFormDialog from '@/components/admin/UserClaimedAchievementFormDialog';
import { useToast } from '@/hooks/use-toast';
import { 
  fetchAdminUserClaimedAchievements,
  updateAdminUserClaimedAchievement,
  createAdminUserClaimedAchievement,
  deleteAdminUserClaimedAchievement
} from '@/api';
import { 
  MOCK_ADMIN_USER_CLAIMED_ACHIEVEMENTS,
  ADMIN_USER_CLAIMED_ACHIEVEMENT_PRIMARY_KEY
} from '@/constants';
import { formatDateTime } from '@/lib/datetime';

const columnHelper = createColumnHelper();

export default function AdminUserClaimedAchievements() {
  const { toast } = useToast();
  const [rows, setRows] = useState(() => []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeRecord, setActiveRecord] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await fetchAdminUserClaimedAchievements();
      if (Array.isArray(list) && list.length) {
        setRows(list);
      }
    } catch (err) {
      setError(err?.message || 'Failed to load records');
      toast.error('Failed to load records');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { loadData(); }, [loadData]);

  const data = useMemo(() => rows, [rows]);

  const handleSave = useCallback(async (updated) => {
    const pk = ADMIN_USER_CLAIMED_ACHIEVEMENT_PRIMARY_KEY;
    try {
      if (updated[pk]) {
        await updateAdminUserClaimedAchievement(updated[pk], updated);
        toast.success('Record updated successfully.');
      } else {
        const payload = { ...updated };
        await createAdminUserClaimedAchievement(payload);
        toast.success('Record created successfully.');
      }
      await loadData();
    } catch (err) {
      toast.error(err?.message || 'Failed to save record');
      throw err;
    }
  }, [loadData, toast]);

  const columns = useMemo(() => [
    columnHelper.accessor('username', {
      header: 'Username',
      cell: info => <span className="font-medium text-neutral-100">{info.getValue() || '—'}</span>,
      sortingFn: 'alphanumeric',
    }),
    columnHelper.accessor('achievement', {
      header: 'Achievement ID',
      sortingFn: 'alphanumeric',
    }),
    columnHelper.accessor('claimed_date', {
      header: 'Claimed Date',
      cell: info => <span className="text-neutral-300">{formatDateTime(info.getValue()) || '—'}</span>,
      sortingFn: (rowA, rowB, columnId) => {
        const a = rowA.getValue(columnId);
        const b = rowB.getValue(columnId);
        const at = a ? Date.parse(a) : 0;
        const bt = b ? Date.parse(b) : 0;
        return at === bt ? 0 : at > bt ? 1 : -1;
      },
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: info => {
        const record = info.row.original;
        return (
          <div className="flex gap-1">
            <AdminActionButton variant="outline" onClick={() => setActiveRecord(record)}>Modify</AdminActionButton>
            <AdminActionButton variant="destructive" onClick={async () => {
              const pk = ADMIN_USER_CLAIMED_ACHIEVEMENT_PRIMARY_KEY;
              if (!record[pk]) return;
              if (!window.confirm('Delete this record? This cannot be undone.')) return;
              try {
                await deleteAdminUserClaimedAchievement(record[pk]);
                toast.success('Record deleted.');
                await loadData();
              } catch (err) {
                toast.error(err?.message || 'Failed to delete record');
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
        <h2 className="text-2xl font-semibold">User Claimed Achievements</h2>
        <div className="flex flex-col gap-2 sm:items-end sm:text-right">
          <button
            className="inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium transition-colors hover:bg-neutral-800 bg-neutral-900 text-neutral-100 border border-neutral-800 hover:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            onClick={() => setActiveRecord({
              user_claimed_achievement_id: undefined,
              user_id: '',
              username: '',
              achievement_id: '',
              claimed_date: ''
            })}
          >Create New</button>
        </div>
      </header>

      <section className="space-y-4">
        <div className="rounded border border-neutral-800 bg-neutral-950/30 p-0">
          {error && (
            <div className="p-3 text-sm text-destructive border-b border-destructive/30 bg-destructive/5">{error}</div>
          )}
          {loading ? (
            <div className="p-6 text-sm text-neutral-400">Loading records...</div>
          ) : (
            <DataTable columns={columns} data={data} />
          )}
        </div>
      </section>
      <UserClaimedAchievementFormDialog
        open={!!activeRecord}
        onOpenChange={(o) => { if (!o) setActiveRecord(null); }}
        record={activeRecord}
        onSave={handleSave}
      />
    </div>
  );
}
