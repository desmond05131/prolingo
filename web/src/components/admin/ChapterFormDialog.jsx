import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import RemoteSelect from '@/components/ui/remote-select';
import { ADMIN_CHAPTER_PRIMARY_KEY } from '@/constants';
import { fetchAdminCourses } from '@/api';

export default function ChapterFormDialog({ open, onOpenChange, record, onSave, primaryKey = ADMIN_CHAPTER_PRIMARY_KEY }) {
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

  // No component-specific loading; use RemoteSelect for fetching options.

  // The SelectValue will render the selected item's text automatically.

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = { ...form };
      if (payload.order_index === '') payload.order_index = null;
      const maybe = onSave?.(payload);
      if (maybe && typeof maybe.then === 'function') await maybe;
      onOpenChange(false);
    } catch (err) {
      setError(err?.message || 'Failed to save chapter');
    } finally {
      setSaving(false);
    }
  };

  if (!record) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isCreate ? 'Create Chapter' : 'Edit Chapter'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {error && (
            <div className="text-sm text-destructive border border-destructive/40 bg-destructive/10 rounded px-3 py-2">{error}</div>
          )}
          <div className="grid gap-4">
            <div className="space-y-1">
              <Label htmlFor="course">Course</Label>
              <RemoteSelect
                id="course"
                value={String(form.course) || ''}
                onChange={(value) => setForm(f => ({ ...f, course: value }))}
                fetcher={(signal) => fetchAdminCourses(signal)}
                getValue={(c) => c.course_id}
                getLabel={(c) => c.title}
                placeholder="Select a course"
                enabled={open}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" value={form.title || ''} onChange={handleChange} placeholder="Chapter title" />
            </div>
            {/* <div className="space-y-1">
              <Label htmlFor="chapter_id">Chapter ID</Label>
              <Input id="chapter_id" name="chapter_id" value={form.chapter_id || ''} onChange={handleChange} placeholder="chap_001" />
            </div> */}
            <div className="space-y-1">
              <Label htmlFor="order_index">Chapter Number</Label>
              <Input id="order_index" name="order_index" type="number" min="1" step="1" value={form.order_index ?? ''} onChange={(e) => setForm(f => ({ ...f, order_index: e.target.value === '' ? '' : Number(e.target.value) }))} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="learning_resource_url">Study Resource URL</Label>
              <Input id="learning_resource_url" name="learning_resource_url" value={form.learning_resource_url || ''} onChange={handleChange} placeholder="https://..." />
            </div>
            <div className="space-y-1">
              <Label htmlFor="description">Description</Label>
              <Input id="description" name="description" value={form.description || ''} onChange={handleChange} placeholder="Optional" />
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
