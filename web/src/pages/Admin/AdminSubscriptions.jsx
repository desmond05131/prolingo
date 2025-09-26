import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { MOCK_ADMIN_SUBSCRIPTIONS } from '@/constants'; // fallback during dev
import { StatusBadge } from '@/components/ui/status-badge';
import { DataTable } from '@/components/ui/data-table';
import { createColumnHelper } from '@tanstack/react-table';
import AdminActionButton from '@/components/admin/AdminActionButton';
import SubscriptionFormDialog from '@/components/admin/SubscriptionFormDialog';
import { ADMIN_SUBSCRIPTION_PRIMARY_KEY } from '@/constants';
import { fetchAdminSubscriptions, updateAdminSubscription, createAdminSubscription, deleteAdminSubscription } from '@/api';
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
      toast({
        description: 'Failed to load subscriptions',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);
  const [activeRecord, setActiveRecord] = useState(null);

  const data = useMemo(() => rows, [rows]);

  const handleSave = useCallback(async (updated) => {
    const pk = ADMIN_SUBSCRIPTION_PRIMARY_KEY;
    try {
      if (updated[pk]) {
        await updateAdminSubscription(updated[pk], updated);
        toast({ description: 'Subscription updated successfully.' });
      } else {
        // sanitize minimal required fields
        const payload = { ...updated };
        await createAdminSubscription(payload);
        toast({ description: 'Subscription created successfully.' });
      }
      await loadData();
    } catch (err) {
      toast({ description: err?.message || 'Failed to save subscription', variant: 'destructive' });
      throw err; // keep dialog open & show inline error
    }
  }, [loadData, toast]);

  const columns = useMemo(() => [
    columnHelper.accessor('userName', {
      header: 'Username',
      cell: info => <span className="font-medium text-neutral-100">{info.getValue()}</span>,
      sortingFn: 'alphanumeric',
    }),
    columnHelper.accessor('plan', {
      header: 'Subscription Type',
      sortingFn: 'alphanumeric',
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: info => <StatusBadge status={info.getValue()} />,
      sortingFn: 'alphanumeric',
    }),
    columnHelper.accessor('renewsOn', {
      header: 'Renew / End At',
      cell: info => <span className="text-neutral-300">{info.getValue() || '—'}</span>,
      sortingFn: (rowA, rowB, columnId) => {
        const a = rowA.getValue(columnId);
        const b = rowB.getValue(columnId);
        const at = a ? Date.parse(a) : 0;
        const bt = b ? Date.parse(b) : 0;
        return at === bt ? 0 : at > bt ? 1 : -1;
      },
    }),
    columnHelper.accessor('amount', {
      header: 'Amount',
      cell: info => {
        const row = info.row.original;
        return `${row.currency} ${Number(info.getValue()).toFixed(2)}`;
      },
      sortingFn: 'alphanumeric',
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: info => {
        const record = info.row.original;
        return (
          <div className="flex gap-1">
            <AdminActionButton onClick={() => console.log('View', record)}>View</AdminActionButton>
            <AdminActionButton variant="outline" onClick={() => setActiveRecord(record)}>Modify</AdminActionButton>
            <AdminActionButton variant="destructive" onClick={async () => {
              if (!record.id) return;
              if (!window.confirm('Delete this subscription record? This cannot be undone.')) return;
              try {
                await deleteAdminSubscription(record.id);
                toast({ description: 'Subscription deleted.' });
                await loadData();
              } catch (err) {
                toast({ description: err?.message || 'Failed to delete subscription', variant: 'destructive' });
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
              id: undefined,
              userId: '',
              userName: '',
              plan: '',
              status: 'active',
              renewsOn: '',
              amount: 0,
              currency: 'USD'
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