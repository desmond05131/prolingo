import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ADMIN_COURSE_PRIMARY_KEY } from '@/constants';

export default function CourseFormDialog({ open, onOpenChange, record, onSave, primaryKey = ADMIN_COURSE_PRIMARY_KEY }) {
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
      setError(err?.message || 'Failed to save course');
    } finally {
      setSaving(false);
    }
  };

  if (!record) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isCreate ? 'Create Course' : 'Edit Course'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {error && (
            <div className="text-sm text-destructive border border-destructive/40 bg-destructive/10 rounded px-3 py-2">{error}</div>
          )}
          <div className="grid gap-4">
            <div className="space-y-1">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" value={form.title || ''} onChange={handleChange} placeholder="Course title" />
            </div>
            {/* <div className="space-y-1">
              <Label htmlFor="course_id">Course ID</Label>
              <Input id="course_id" name="course_id" value={form.course_id || ''} onChange={handleChange} placeholder="course_123" />
            </div> */}
            <div className="space-y-1">
              <Label htmlFor="description">Description</Label>
              <Input id="description" name="description" value={form.description || ''} onChange={handleChange} placeholder="Optional" />
            </div>
            <div className="space-y-1">
              <Label>Status</Label>
              <Select value={form.status || 'draft'} onValueChange={(v) => setForm(f => ({ ...f, status: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
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
