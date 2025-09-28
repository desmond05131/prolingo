import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ADMIN_USER_TEST_PRIMARY_KEY } from '@/constants';
import { fetchAdminTests, fetchAdminUsers } from '@/api';
import RemoteSelect from '../ui/remote-select';

export default function UserTestFormDialog({ open, onOpenChange, record, onSave, primaryKey = ADMIN_USER_TEST_PRIMARY_KEY }) {
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
          <DialogTitle>{isCreate ? 'Create User Test' : 'Edit User Test'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {error && (
            <div className="text-sm text-destructive border border-destructive/40 bg-destructive/10 rounded px-3 py-2">{error}</div>
          )}
          <div className="grid gap-4">
            <div className="space-y-1">
              <Label htmlFor="test_id">User</Label>
              <RemoteSelect
                id="user"
                value={String(form.user ?? '')}
                onChange={(val) => setForm(f => ({ ...f, user: val }))}
                fetcher={fetchAdminUsers}
                getValue={(u) => u.id}
                getLabel={(u) => u.username}
                placeholder="Select a user"
                enabled={open}
                disabled={!isCreate && !!(record?.user)}
                />
            </div>
            <div className="space-y-1">
              <Label htmlFor="test_id">Test</Label>
              <RemoteSelect
                id="test"
                value={String(form.test ?? '')}
                onChange={(val) => setForm(f => ({ ...f, test: val }))}
                fetcher={fetchAdminTests}
                getValue={(u) => u?.test?.test_id ?? '-'}
                getLabel={(u) => u?.test?.title ?? 'N/A'}
                placeholder="Select a test"
                enabled={open}
                disabled={!isCreate && !!(record?.test)}
                />
            </div>
            <div className="space-y-1">
              <Label htmlFor="attempt_date">Attempt Date/Time</Label>
              <Input id="attempt_date" name="attempt_date" type="datetime-local" value={form.attempt_date || ''} onChange={handleChange} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="time_spent">Time Spent (s)</Label>
              <Input id="time_spent" name="time_spent" type="number" min="0" step="1" value={form.time_spent ?? ''} onChange={(e) => setForm(f => ({ ...f, time_spent: e.target.value === '' ? '' : Number(e.target.value) }))} />
            </div>
          </div>
          <DialogFooter className="pt-2">
            <DialogClose asChild>
              <Button type="button" variant="ghost" disabled={saving}>Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={saving}>{saving ? (isCreate ? 'Creating...' : 'Saving...') : (isCreate ? 'Create' : 'Save')}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
