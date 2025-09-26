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
import { ADMIN_USER_GAMEINFO_PRIMARY_KEY } from '@/constants';
import { fetchAdminUsers } from '@/api';
import RemoteSelect from '../ui/remote-select';

/**
 * UserGameInfoFormDialog
 * Handles create/edit for UserGameInfo records.
 * Fields: username (display), user_id, xp_value, energy_value, energy_last_updated_date
 */
export function UserGameInfoFormDialog({ open, onOpenChange, record, onSave, primaryKey = ADMIN_USER_GAMEINFO_PRIMARY_KEY }) {
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

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value === '' ? '' : Number(value) }));
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
          <DialogTitle>{isCreate ? 'Create User Game Info' : 'Edit User Game Info'}</DialogTitle>
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>XP Value</Label>
                <Input name="xp_value" type="number" min="0" value={form.xp_value ?? ''} onChange={handleNumberChange} />
              </div>
              <div className="space-y-1">
                <Label>Energy Value</Label>
                <Input name="energy_value" type="number" min="0" value={form.energy_value ?? ''} onChange={handleNumberChange} />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="energy_last_updated_date">Energy Last Updated</Label>
              <Input id="energy_last_updated_date" name="energy_last_updated_date" type="datetime-local" value={form.energy_last_updated_date ? form.energy_last_updated_date.slice(0,16) : ''} onChange={handleChange} />
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

export default UserGameInfoFormDialog;
