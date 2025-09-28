import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { MOCK_ADMIN_SUBSCRIPTIONS } from '@/constants'; // fallback during dev
import { StatusBadge } from '@/components/ui/status-badge';
import { DataTable } from '@/components/ui/data-table';
import { createColumnHelper } from '@tanstack/react-table';
import AdminActionButton from '@/components/admin/AdminActionButton';
import SubscriptionFormDialog from '@/components/admin/SubscriptionFormDialog';
import { ADMIN_SUBSCRIPTION_PRIMARY_KEY } from '@/constants';
import { fetchAdminSubscriptions, updateAdminSubscription, createAdminSubscription, deleteAdminSubscription } from '@/api';
import { formatDate, formatDateTime, toTimestamp } from '@/lib/datetime';
import { useToast } from '@/hooks/use-toast';

const columnHelper = createColumnHelper();

export default function AdminSubscriptions() {
  const { toast } = useToast();
  const [rows, setRows] = useState(() => []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await fetchAdminSubscriptions();
      if (Array.isArray(list) && list.length) {
        setRows(list);
      }
    } catch (err) {
      setError(err?.message || 'Failed to load subscriptions');
      toast.error('Failed to load subscriptions');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);
  const [activeRecord, setActiveRecord] = useState(null);

  const data = useMemo(() => rows, [rows]);

  const handleSave = useCallback(async (draft) => {
    const pk = ADMIN_SUBSCRIPTION_PRIMARY_KEY;
    try {
      if (draft[pk]) {
        await updateAdminSubscription(draft[pk], draft);
        toast.success('Subscription updated successfully.');
      } else {
        const payload = { ...draft };
        await createAdminSubscription(payload);
        toast.success('Subscription created successfully.');
      }
      await loadData();
    } catch (err) {
      toast.error(err?.message || 'Failed to save subscription');
      throw err; // keep dialog open & show inline error
    }
  }, [loadData, toast]);

  const columns = useMemo(() => [
    columnHelper.accessor('username', {
      header: 'User',
      cell: info => <span className="font-medium text-neutral-100">{info.getValue()}</span>,
      sortingFn: 'alphanumeric',
    }),
    columnHelper.accessor('type', {
      header: 'Type',
      cell: info => <span className="capitalize">{info.getValue()}</span>,
      sortingFn: 'alphanumeric',
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: info => <StatusBadge status={info.getValue()} />,
      sortingFn: 'alphanumeric',
    }),
    columnHelper.accessor('start_date', {
      header: 'Start Date',
      cell: info => <span className="text-neutral-300">{formatDateTime(info.getValue())}</span>,
      sortingFn: (rowA, rowB, columnId) => {
        const at = toTimestamp(rowA.getValue(columnId));
        const bt = toTimestamp(rowB.getValue(columnId));
        return at === bt ? 0 : at > bt ? 1 : -1;
      },
    }),
    columnHelper.accessor('end_date', {
      header: 'End Date',
      cell: info => <span className="text-neutral-300">{formatDateTime(info.getValue())}</span>,
      sortingFn: (rowA, rowB, columnId) => {
        const at = toTimestamp(rowA.getValue(columnId));
        const bt = toTimestamp(rowB.getValue(columnId));
        return at === bt ? 0 : at > bt ? 1 : -1;
      },
    }),
    columnHelper.accessor('is_renewable', {
      header: 'Renewable',
      cell: info => info.getValue() ? 'Yes' : 'No',
      sortingFn: (a,b,id) => {
        const av = a.getValue(id) ? 1 : 0; const bv = b.getValue(id) ? 1 : 0; return av - bv;
      }
    }),
    columnHelper.accessor('amount', {
      header: 'Amount',
      cell: info => `${Number(info.getValue() ?? 0).toFixed(2)}`,
      sortingFn: 'alphanumeric',
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
              if (!record.subscription_id) return;
              if (!window.confirm('Delete this subscription record? This cannot be undone.')) return;
              try {
                await deleteAdminSubscription(record.subscription_id);
                toast.success('Subscription deleted.');
                await loadData();
              } catch (err) {
                toast.error(err?.message || 'Failed to delete subscription');
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
        <h2 className="text-2xl font-semibold">Subscriptions</h2>
        <div className="flex flex-col gap-2 sm:items-end sm:text-right">
          {/* <p className="text-sm text-neutral-400">View and manage user subscription records.</p> */}
          <button
            className="inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium transition-colors hover:bg-neutral-800 bg-neutral-900 text-neutral-100 border border-neutral-800 hover:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            onClick={() => setActiveRecord({
              subscription_id: undefined,
              user_id: '',
              type: 'month',
              start_date: '',
              end_date: '',
              status: 'pending_payment',
              is_renewable: true,
              amount: 0,
            })}
          >Create New Subscription</button>
        </div>
      </header>

      <section className="space-y-4">
        {/* <h3 className="text-lg font-semibold tracking-wide">Current Records</h3> */}
        <div className="rounded border border-neutral-800 bg-neutral-950/30 p-0">
          {error && (
            <div className="p-3 text-sm text-destructive border-b border-destructive/30 bg-destructive/5">{error}</div>
          )}
          {loading ? (
            <div className="p-6 text-sm text-neutral-400">Loading subscriptions...</div>
          ) : (
            <DataTable columns={columns} data={data} />
          )}
        </div>
      </section>
      <SubscriptionFormDialog
        open={!!activeRecord}
        onOpenChange={(o) => { if (!o) setActiveRecord(null); }}
        record={activeRecord}
        onSave={handleSave}
      />
    </div>
  );
}