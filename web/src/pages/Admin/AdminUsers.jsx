import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { MOCK_ADMIN_USERS, ADMIN_USER_PRIMARY_KEY } from '@/constants';
import { DataTable } from '@/components/ui/data-table';
import { createColumnHelper } from '@tanstack/react-table';
import AdminActionButton from '@/components/admin/AdminActionButton';
import UserFormDialog from '@/components/admin/UserFormDialog';
import { useToast } from '@/hooks/use-toast';
import { fetchAdminUsers, createAdminUser, updateAdminUser, deleteAdminUser, toggleAdminUserEmailNotification } from '@/api';
import { formatDate, toTimestamp } from '@/lib/datetime';

const columnHelper = createColumnHelper();

export default function AdminUsers() {
  const { toast } = useToast();
  const [rows, setRows] = useState(() => MOCK_ADMIN_USERS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeRecord, setActiveRecord] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await fetchAdminUsers();
      if (Array.isArray(list) && list.length) setRows(list);
    } catch (err) {
      setError(err?.message || 'Failed to load users');
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleSave = useCallback(async (draft) => {
    const pk = ADMIN_USER_PRIMARY_KEY;
    try {
      if (draft[pk]) {
        await updateAdminUser(draft[pk], draft);
        toast.success('User updated successfully.');
      } else {
        const payload = { ...draft };
        await createAdminUser(payload);
        toast.success('User created successfully.');
      }
      await loadData();
    } catch (err) {
      toast.error(err?.message || 'Failed to save user');
      throw err;
    }
  }, [loadData, toast]);

  const data = useMemo(() => rows, [rows]);

  const columns = useMemo(() => [
    columnHelper.accessor('username', {
      header: 'Username',
      cell: info => <span className="font-medium text-neutral-100">{info.getValue()}</span>,
      sortingFn: 'alphanumeric',
    }),
    columnHelper.accessor('email', {
      header: 'Email',
      sortingFn: 'alphanumeric',
    }),
    columnHelper.accessor('role', {
      header: 'Role',
      sortingFn: 'alphanumeric',
      cell: info => <span className="uppercase tracking-wide text-xs px-2 py-1 rounded bg-neutral-800 text-neutral-200">{info.getValue()}</span>
    }),
    columnHelper.accessor('enable_email_notification', {
      header: 'Enable Email Notifications',
      cell: info => info.getValue() ? 'Enabled' : 'Disabled',
      sortingFn: (a,b,id) => {
        const av = a.getValue(id) ? 1 : 0; const bv = b.getValue(id) ? 1 : 0; return av - bv;
      }
    }),
    columnHelper.accessor('registration_date', {
      header: 'Registered',
      cell: info => formatDate(info.getValue()),
      sortingFn: (rowA, rowB, columnId) => {
        const a = toTimestamp(rowA.getValue(columnId));
        const b = toTimestamp(rowB.getValue(columnId));
        return a === b ? 0 : a > b ? 1 : -1;
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
            <AdminActionButton variant={record.enable_email_notification ? 'outline' : 'default'} onClick={async () => {
              try {
                await toggleAdminUserEmailNotification(record.user_id, !record.enable_email_notification);
                toast.success('Email notification toggled.');
                await loadData();
              } catch (err) {
                toast.error(err?.message || 'Failed to toggle notification');
              }
            }}>{record.enable_email_notification ? 'Disable Email' : 'Enable Email'}</AdminActionButton>
            <AdminActionButton variant="destructive" onClick={async () => {
              if (!record.user_id) return;
              if (!window.confirm('Delete this user? This action is irreversible.')) return;
              try {
                await deleteAdminUser(record.user_id);
                toast.success('User deleted.');
                await loadData();
              } catch (err) {
                toast.error(err?.message || 'Failed to delete user');
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
        <h2 className="text-2xl font-semibold">Users</h2>
        <div className="flex flex-col gap-2 sm:items-end sm:text-right">
          <button
            className="inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium transition-colors hover:bg-neutral-800 bg-neutral-900 text-neutral-100 border border-neutral-800 hover:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            onClick={() => setActiveRecord({
              user_id: undefined,
              username: '',
              email: '',
              password: '',
              profile_icon: '',
              role: 'student',
              registration_date: '',
              enable_email_notification: true,
            })}
          >Create New User</button>
        </div>
      </header>

      <section className="space-y-4">
        <div className="rounded border border-neutral-800 bg-neutral-950/30 p-0">
          {error && (
            <div className="p-3 text-sm text-destructive border-b border-destructive/30 bg-destructive/5">{error}</div>
          )}
          {loading ? (
            <div className="p-6 text-sm text-neutral-400">Loading users...</div>
          ) : (
            <DataTable columns={columns} data={data} />
          )}
        </div>
      </section>
      <UserFormDialog
        open={!!activeRecord}
        onOpenChange={(o) => { if (!o) setActiveRecord(null); }}
        record={activeRecord}
        onSave={handleSave}
      />
    </div>
  );
}
