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
import { ADMIN_TEST_PRIMARY_KEY } from '@/constants';
import RemoteSelect from '@/components/ui/remote-select';
import { fetchAdminCourses, fetchAdminChapters } from '@/api';

export default function CourseTestFormDialog({ open, onOpenChange, record, onSave, primaryKey = ADMIN_TEST_PRIMARY_KEY }) {
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
      const payload = { ...form };
      if (payload.passing_score === '') payload.passing_score = null;
      const maybe = onSave?.(payload);
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
          <DialogTitle>{isCreate ? 'Create Test' : 'Edit Test'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {error && (
            <div className="text-sm text-destructive border border-destructive/40 bg-destructive/10 rounded px-3 py-2">{error}</div>
          )}
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="space-y-1">
                <Label htmlFor="course_id">Course</Label>
                <RemoteSelect
                  id="course_id"
                  value={String(form.course) || ''}
                  onChange={(val) => setForm(f => ({ ...f, course: val || '', chapter: '' }))}
                  fetcher={fetchAdminCourses}
                  getValue={(x) => x?.course_id}
                  getLabel={(x) => x?.title}
                  placeholder="Select a course"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="chapter_id">Chapter</Label>
                <RemoteSelect
                  id="chapter_id"
                  value={String(form.chapter) || ''}
                  onChange={(val) => setForm(f => ({ ...f, chapter: val || '' }))}
                  fetcher={(signal) => fetchAdminChapters(signal).then(list => Array.isArray(list) ? list.filter(c => c?.course == form.course) : [])}
                  getValue={(x) => x?.chapter_id}
                  getLabel={(x) => x?.title}
                  placeholder={form.course ? 'Select a chapter' : 'Select a course first'}
                  enabled={!!form.course}
                  disabled={!form.course}
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" value={form.title || ''} onChange={handleChange} placeholder="Eg: Chapter 1 Quiz" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="order_index">Test Number</Label>
                <Input id="order_index" name="order_index" type="number" min="1" step="1" value={form.order_index ?? ''} onChange={(e) => setForm(f => ({ ...f, order_index: e.target.value === '' ? '' : Number(e.target.value) }))} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="passing_score">Passing Score</Label>
                <Input id="passing_score" name="passing_score" type="number" min="0" max="100" step="1" value={form.passing_score ?? ''} onChange={(e) => setForm(f => ({ ...f, passing_score: e.target.value === '' ? '' : Number(e.target.value) }))} />
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
