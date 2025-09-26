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
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ADMIN_USER_PRIMARY_KEY } from '@/constants';

/**
 * UserFormDialog
 * Handles both create and edit flows.
 * Props:
 *  open
 *  onOpenChange
 *  record (object or null)
 *  onSave: (recordDraft) => Promise
 *  primaryKey? (override default)
 */
export function UserFormDialog({ open, onOpenChange, record, onSave, primaryKey = ADMIN_USER_PRIMARY_KEY }) {
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

  if (!record) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleCheckbox = (e) => {
    const { name, checked } = e.target;
    setForm(f => ({ ...f, [name]: checked }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const draft = { ...form };
      // Only send password if creating or if user entered a new one (non-empty string)
      if (!isCreate && !draft.password) {
        delete draft.password; // ensure not overwriting existing password with blank
      }
      const maybe = onSave?.(draft);
      if (maybe && typeof maybe.then === 'function') await maybe;
      onOpenChange(false);
    } catch (err) {
      setError(err?.message || 'Failed to save user');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isCreate ? 'Create User' : 'Edit User'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {error && (
            <div className="text-sm text-destructive border border-destructive/40 bg-destructive/10 rounded px-3 py-2">
              {error}
            </div>
          )}
          <div className="grid gap-4">
            <div className="space-y-1">
              <Label>Username</Label>
              <Input
                name="username"
                value={form.username || ''}
                onChange={handleChange}
                placeholder="Jane Developer"
              />
            </div>
            <div className="space-y-1">
              <Label>Email</Label>
              <Input
                type="email"
                name="email"
                value={form.email || ''}
                onChange={handleChange}
                placeholder="user@example.com"
              />
            </div>
            <div className="space-y-1">
              <Label>{isCreate ? 'Password' : 'Password (leave blank to keep)'}</Label>
              <Input
                type="password"
                name="password"
                value={form.password || ''}
                onChange={handleChange}
                placeholder={isCreate ? '••••••••' : ''}
              />
            </div>
            <div className="space-y-1">
              <Label>Role</Label>
              <Select value={form.role} onValueChange={(v) => setForm(f => ({ ...f, role: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="lecturer">Lecturer</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Profile Icon URL</Label>
              <Input
                name="profile_icon"
                value={form.profile_icon || ''}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="enable_email_notification"
                name="enable_email_notification"
                checked={!!form.enable_email_notification}
                onChange={handleCheckbox}
                className="h-4 w-4 rounded border-neutral-600 bg-neutral-900 text-neutral-50 focus:ring-1 focus:ring-neutral-400"
              />
              <Label htmlFor="enable_email_notification" className="cursor-pointer">Email Notifications Enabled</Label>
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

export default UserFormDialog;
