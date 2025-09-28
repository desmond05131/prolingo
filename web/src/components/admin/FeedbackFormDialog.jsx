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
import { Textarea } from '@/components/ui/textarea';
import { ADMIN_FEEDBACK_PRIMARY_KEY } from '@/constants';

/**
 * FeedbackFormDialog
 * Handles create/edit for feedback records.
 * Fields:
 *  feedback_id (PK) - optional in create
 *  message (text)
 *  created_by (string - username or id)
 *  created_date (ISO date - readonly after create)
 *  updated_by (string - username or id)
 *  updated_date (ISO date - readonly, auto when updating)
 */
export function FeedbackFormDialog({ open, onOpenChange, record, onSave, primaryKey = ADMIN_FEEDBACK_PRIMARY_KEY }) {
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
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isCreate ? 'Create Feedback' : 'Edit Feedback'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {error && (
            <div className="text-sm text-destructive border border-destructive/40 bg-destructive/10 rounded px-3 py-2">
              {error}
            </div>
          )}
          <div className="grid gap-4">
            <div className="space-y-1">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                name="message"
                value={form.message || ''}
                onChange={handleChange}
                placeholder="Enter user feedback message..."
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="created_by">Created By</Label>
                <Input
                  id="created_by"
                  name="created_by"
                  value={form.created_by || ''}
                  onChange={handleChange}
                  placeholder="username"
                  disabled={!isCreate && !!record.created_by}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="created_date">Created Date</Label>
                <Input
                  id="created_date"
                  name="created_date"
                  type="datetime-local"
                  value={form.created_date ? new Date(form.created_date).toISOString().slice(0,16) : ''}
                  onChange={(e) => setForm(f => ({ ...f, created_date: new Date(e.target.value).toISOString() }))}
                  disabled={!isCreate}
                />
              </div>
            </div>
            {!isCreate && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="updated_by">Updated By</Label>
                  <Input
                    id="updated_by"
                    name="updated_by"
                    value={form.updated_by || ''}
                    onChange={handleChange}
                    placeholder="username"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="updated_date">Updated Date</Label>
                  <Input
                    id="updated_date"
                    name="updated_date"
                    type="datetime-local"
                    value={form.updated_date ? new Date(form.updated_date).toISOString().slice(0,16) : ''}
                    onChange={(e) => setForm(f => ({ ...f, updated_date: new Date(e.target.value).toISOString() }))}
                  />
                </div>
              </div>
            )}
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

export default FeedbackFormDialog;
