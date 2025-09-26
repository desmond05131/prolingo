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
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ADMIN_QUESTION_PRIMARY_KEY } from '@/constants';

export default function QuestionFormDialog({ open, onOpenChange, record, onSave, parentTestId, primaryKey = ADMIN_QUESTION_PRIMARY_KEY }) {
  const hasPrimary = !!(record && record[primaryKey]);
  const isCreate = !hasPrimary;
  const [form, setForm] = useState(() => ({ ...record }));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open) {
      const base = { ...record };
      if (!base.test_id && parentTestId) base.test_id = parentTestId;
      setForm(base);
      setError(null);
    }
  }, [record, parentTestId, open]);

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
          <DialogTitle>{isCreate ? 'Create Question' : 'Edit Question'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {error && (
            <div className="text-sm text-destructive border border-destructive/40 bg-destructive/10 rounded px-3 py-2">{error}</div>
          )}
          <div className="grid gap-4">
            <div className="space-y-1">
              <Label htmlFor="text">Question Text</Label>
              <Input id="text" name="text" value={form.text || ''} onChange={handleChange} placeholder="Enter the question" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="question_id">Question ID</Label>
                <Input id="question_id" name="question_id" value={form.question_id || ''} onChange={handleChange} placeholder="q_001" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="order_index">Order</Label>
                <Input id="order_index" name="order_index" type="number" min="1" step="1" value={form.order_index ?? ''} onChange={(e) => setForm(f => ({ ...f, order_index: e.target.value === '' ? '' : Number(e.target.value) }))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="test_id">Test ID</Label>
                <Input id="test_id" name="test_id" value={form.test_id || ''} onChange={handleChange} placeholder="test_101" />
              </div>
              <div className="space-y-1">
                <Label>Type</Label>
                <Select value={form.type || 'MCQ'} onValueChange={(v) => setForm(f => ({ ...f, type: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MCQ">MCQ</SelectItem>
                    <SelectItem value="fill-in-blank">fill-in-blank</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="correct_answer_text">Correct Answer (text)</Label>
              <Input id="correct_answer_text" name="correct_answer_text" value={form.correct_answer_text || ''} onChange={handleChange} placeholder="Answer text or label" />
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
