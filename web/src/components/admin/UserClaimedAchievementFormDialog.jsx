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
import { ADMIN_USER_CLAIMED_ACHIEVEMENT_PRIMARY_KEY } from '@/constants';
import { fetchAdminAchievements, fetchAdminUsers } from '@/api';
import RemoteSelect from '../ui/remote-select';

/**
 * UserClaimedAchievementFormDialog
 * Create/Edit dialog for user claimed achievements.
 * Fields:
 *  - user_id (text)
 *  - username (text helper, optional)
 *  - achievement_id (text)
 *  - claimed_date (date)
 */
export default function UserClaimedAchievementFormDialog({ open, onOpenChange, record, onSave, primaryKey = ADMIN_USER_CLAIMED_ACHIEVEMENT_PRIMARY_KEY }) {
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
          <DialogTitle>{isCreate ? 'Create Claimed Achievement' : 'Edit Claimed Achievement'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {error && (
            <div className="text-sm text-destructive border border-destructive/40 bg-destructive/10 rounded px-3 py-2">
              {error}
            </div>
          )}
          <div className="grid gap-4">
            <div className="space-y-1">
              <Label>User</Label>
              {/* <Input name="user_id" value={form.user_id || ''} onChange={handleChange} placeholder="user_123" /> */}
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
              <Label>Username (optional)</Label>
              <Input name="username" value={form.username || ''} onChange={handleChange} placeholder="Jane Developer" />
            </div> */}
            <div className="space-y-1">
              <Label>Achievement</Label>
              <RemoteSelect
                id="achievement"
                value={String(form.achievement ?? '')}
                onChange={(val) => setForm(f => ({ ...f, achievement: val }))}
                fetcher={fetchAdminAchievements}
                getValue={(a) => a.achievement_id}
                getLabel={(a) => a.reward_type === 'badge' ? `Badge - ${a.reward_content_description}` : `${a.reward_amount}${a.reward_type.toUpperCase()}`}
                placeholder="Select an achievement"
                enabled={open}
                disabled={!isCreate && !!(record?.achievement)}
              />
              {/* <Input name="achievement_id" value={form.achievement_id || ''} onChange={handleChange} placeholder="achv_001" /> */}
            </div>
            <div className="space-y-1">
              <Label htmlFor="claimed_date">Claimed Date</Label>
              <Input id="claimed_date" name="claimed_date" type="datetime" value={form.claimed_date || ''} onChange={handleChange} />
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
