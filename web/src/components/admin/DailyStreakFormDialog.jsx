import React, { useState, useEffect } from 'react';
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
import { ADMIN_DAILY_STREAK_PRIMARY_KEY } from '@/constants';
import { fetchAdminUsers } from '@/api';
import RemoteSelect from '../ui/remote-select';

/**
 * DailyStreakFormDialog
 * Fields: username (display), user_id, daily_streak_date, is_streak_saver
 */
export function DailyStreakFormDialog({ open, onOpenChange, record, onSave, primaryKey = ADMIN_DAILY_STREAK_PRIMARY_KEY }) {
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
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
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
          <DialogTitle>{isCreate ? 'Create Daily Streak' : 'Edit Daily Streak'}</DialogTitle>
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
              {/* <Input
                name="username"
                value={form.username || ''}
                onChange={handleChange}
                placeholder="Jane Developer"
                disabled={!isCreate && !!record.username}
              /> */}
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
            {/* <div className="space-y-1">
              <Label>User ID</Label>
              <Input
                name="user_id"
                value={form.user_id || ''}
                onChange={handleChange}
                placeholder="user_123"
                disabled={!isCreate && !!record.user_id}
              />
            </div> */}
            <div className="space-y-1">
              <Label htmlFor="daily_streak_date">Streak Date</Label>
              <Input id="daily_streak_date" name="daily_streak_date" type="datetime" value={form.daily_streak_date || ''} onChange={handleChange} />
            </div>
            <div className="flex items-center gap-2">
              <input id="is_streak_saver" name="is_streak_saver" type="checkbox" className="h-4 w-4" checked={!!form.is_streak_saver} onChange={handleChange} />
              <Label htmlFor="is_streak_saver" className="cursor-pointer">Used Streak Saver</Label>
            </div>
          </div>
          <DialogFooter className="pt-2">
            <DialogClose asChild>
              <Button type="button" variant="ghost" disabled={saving}>Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={saving}>{saving ? (isCreate ? 'Creating...' : 'Saving...') : (isCreate ? 'Create' : 'Save Changes')}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default DailyStreakFormDialog;
