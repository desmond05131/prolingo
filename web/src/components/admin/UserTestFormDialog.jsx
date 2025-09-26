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
              <Label htmlFor="username">Username</Label>
              <Input id="username" name="username" value={form.username || ''} onChange={handleChange} placeholder="Jane Developer" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="user_id">User ID</Label>
                <Input id="user_id" name="user_id" value={form.user_id || ''} onChange={handleChange} placeholder="user_123" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="test_id">Test ID</Label>
                <Input id="test_id" name="test_id" value={form.test_id || ''} onChange={handleChange} placeholder="test_101" />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="test_title">Test Title</Label>
              <Input id="test_title" name="test_title" value={form.test_title || ''} onChange={handleChange} placeholder="Placement Test" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="attempt_date">Attempt Date/Time</Label>
                <Input id="attempt_date" name="attempt_date" type="datetime-local" value={form.attempt_date || ''} onChange={handleChange} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="time_spent">Time Spent (s)</Label>
                <Input id="time_spent" name="time_spent" type="number" min="0" step="1" value={form.time_spent ?? ''} onChange={(e) => setForm(f => ({ ...f, time_spent: e.target.value === '' ? '' : Number(e.target.value) }))} />
              </div>
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
