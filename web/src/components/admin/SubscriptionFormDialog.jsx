import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ADMIN_SUBSCRIPTION_PRIMARY_KEY } from '@/constants';

/**
 * SubscriptionFormDialog
 * Handles both create and edit modes based on absence/presence of the configured primary key.
 * Props:
 *  open
 *  onOpenChange
 *  record
 *  onSave: (record) => Promise
 *  primaryKey? (override constant if needed)
 */
export function SubscriptionFormDialog({ open, onOpenChange, record, onSave, primaryKey = ADMIN_SUBSCRIPTION_PRIMARY_KEY }) {
  const hasPrimary = !!(record && record[primaryKey]);
  const isCreate = !hasPrimary;
  const [form, setForm] = useState(() => ({ ...record }));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open) {
      setForm({ ...record });
      setError(null);
    }
  }, [record, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const maybe = onSave?.(form);
      if (maybe && typeof maybe.then === 'function') await maybe;
      onOpenChange(false);
    } catch (err) {
      setError(err?.message || 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  if (!record) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isCreate ? 'Create Subscription' : 'Edit Subscription'}</DialogTitle>
          {/* <DialogDescription>
            {isCreate ? 'Enter details for the new subscription.' : (
              <>Update fields for <span className="font-medium">{record.userName}</span>.</>
            )}
          </DialogDescription> */}
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {error && (
            <div className="text-sm text-destructive border border-destructive/40 bg-destructive/10 rounded px-3 py-2">
              {error}
            </div>
          )}
          <div className="grid gap-4">
            <div className="space-y-1">
              <Label>User Name</Label>
              <Input
                name="userName"
                value={form.userName || ''}
                onChange={handleChange}
                placeholder="Jane Developer"
                disabled={!isCreate && !!record.userName}
              />
            </div>
            <div className="space-y-1">
              <Label>Plan</Label>
              <Select value={form.plan} onValueChange={(v) => setForm(f => ({ ...f, plan: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FREE">FREE</SelectItem>
                  <SelectItem value="BASIC">BASIC</SelectItem>
                  <SelectItem value="PRO">PRO</SelectItem>
                  <SelectItem value="PREMIUM">PREMIUM</SelectItem>
                  <SelectItem value="TEAM">TEAM</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm(f => ({ ...f, status: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="canceled">Canceled</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="trialing">Trialing</SelectItem>
                  <SelectItem value="past_due">Past Due</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="renewsOn">Renew / End At</Label>
              <Input id="renewsOn" name="renewsOn" type="date" value={form.renewsOn || ''} onChange={handleChange} />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1 col-span-2">
                <Label htmlFor="amount">Amount</Label>
                <Input id="amount" name="amount" type="number" min="0" step="0.01" value={form.amount ?? ''} onChange={(e) => setForm(f => ({ ...f, amount: e.target.value === '' ? '' : Number(e.target.value) }))} />
              </div>
              <div className="space-y-1">
                <Label>Currency</Label>
                <Select value={form.currency} onValueChange={(v) => setForm(f => ({ ...f, currency: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                    <SelectItem value="JPY">JPY</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter className="pt-2">
            <DialogClose asChild>
              <Button type="button" variant="ghost" disabled={saving}>Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={saving}>
              {saving ? (isCreate ? 'Creating...' : 'Saving...') : (isCreate ? 'Create' : 'Save Changes')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default SubscriptionFormDialog;
