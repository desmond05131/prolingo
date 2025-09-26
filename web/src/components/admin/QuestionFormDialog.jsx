import React, { useEffect, useMemo, useState } from 'react';
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

export default function QuestionFormDialog({
  open,
  onOpenChange,
  record,
  onSave,
  parentTestId,
  primaryKey = ADMIN_QUESTION_PRIMARY_KEY,
  // New props pushed up to parent to keep API calls out of this component
  choices,
  loadChoices,
  onAddChoice,
  onEditChoice,
  onDeleteChoice,
}) {
  const hasPrimary = !!(record && record[primaryKey]);
  const isCreate = !hasPrimary;
  const [form, setForm] = useState(() => ({ ...record }));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  // Local question id after create (so we can manage choices without closing dialog)
  const localQuestionId = useMemo(() => form?.[primaryKey] ?? record?.[primaryKey], [form, record, primaryKey]);

  // Local UI state for MCQ editing inputs
  const [addingChoiceText, setAddingChoiceText] = useState('');
  const [editingChoiceId, setEditingChoiceId] = useState(null);
  const [editingChoiceText, setEditingChoiceText] = useState('');

  useEffect(() => {
    if (open) {
      const base = { ...record };
      if (!base.test && parentTestId) base.test = parentTestId;
      setForm(base);
      setError(null);

      // Reset choices panel state
      setAddingChoiceText('');
      setEditingChoiceId(null);
      setEditingChoiceText('');

      // If editing an MCQ with id, load choices
      const qid = base?.[primaryKey];
      if (base?.type === 'mcq' && qid && typeof loadChoices === 'function') {
        void loadChoices(qid);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
      const result = (maybe && typeof maybe.then === 'function') ? await maybe : maybe;

      // If created an MCQ, keep dialog open and load choices using returned id
      if (isCreate && (form.type === 'mcq')) {
        const created = result || {};
        const newId = created?.[primaryKey];
        if (newId) {
          setForm(f => ({ ...f, [primaryKey]: newId }));
          if (typeof loadChoices === 'function') {
            await loadChoices(newId);
          }
          return; // do not close, stay to manage choices
        }
      }

      // Default behavior: close dialog
      onOpenChange(false);
    } catch (err) {
      setError(err?.message || 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  async function handleAddChoice() {
    const text = (addingChoiceText || '').trim();
    if (!text) return;
    if (!localQuestionId) {
      // Parent should handle toast UX
      return;
    }
    const nextOrder = (choices?.length || 0) + 1;
    await onAddChoice?.(localQuestionId, text, nextOrder);
    setAddingChoiceText('');
  }

  function beginEditChoice(ch) {
    setEditingChoiceId(ch.choice_id);
    setEditingChoiceText(ch.text);
  }

  async function handleSaveChoiceEdit(ch) {
    const text = (editingChoiceText || '').trim();
    if (!text) return;
    await onEditChoice?.(ch.choice_id, ch.question_id, text);
    // If the correct answer text matches the old choice text, update it locally
    setForm(f => (f?.correct_answer_text === ch.text ? { ...f, correct_answer_text: text } : f));
    setEditingChoiceId(null);
    setEditingChoiceText('');
  }

  async function handleDeleteChoice(ch) {
    if (!window.confirm('Delete this choice?')) return;
    await onDeleteChoice?.(ch.choice_id, ch.question_id);
    // Clear correct answer if it was pointing to this text
    setForm(f => (f?.correct_answer_text === ch.text ? { ...f, correct_answer_text: '' } : f));
  }

  if (!record) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isCreate ? 'Create Question' : 'Edit Question'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {error && (
            <div className="text-sm text-destructive border border-destructive/40 bg-destructive/10 rounded px-3 py-2">{error}</div>
          )}
          <div className="grid gap-4">
            <div className="flex gap-3">
              {/* <div className="space-y-1">
                <Label htmlFor="question_id">Question ID</Label>
                <Input id="question_id" name="question_id" value={form.question_id || ''} onChange={handleChange} placeholder="q_001" />
              </div> */}
              <div className="space-y-1">
                <Label htmlFor="order_index">Question Number</Label>
                <Input id="order_index" name="order_index" type="number" min="1" step="1" value={form.order_index ?? ''} onChange={(e) => setForm(f => ({ ...f, order_index: e.target.value === '' ? '' : Number(e.target.value) }))} />
              </div>
              <div className="flex-1 space-y-1">
                <Label htmlFor="text">Question</Label>
                <Input id="text" name="text" value={form.text || ''} onChange={handleChange} placeholder="Enter the question" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {/* <div className="space-y-1">
                <Label htmlFor="test_id">Test ID</Label>
                <Input id="test_id" name="test_id" value={form.test_id || ''} onChange={handleChange} placeholder="test_101" />
              </div> */}
              <div className="space-y-1">
                <Label>Answer Type</Label>
                <Select value={form.type || 'mcq'} onValueChange={(v) => setForm(f => ({ ...f, type: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mcq">MCQ</SelectItem>
                    <SelectItem value="fill_in_blank">Fill In The Blank</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {form.type === 'fill_in_blank' && <div className="space-y-1">
              <Label htmlFor="correct_answer_text">Correct Answer (text)</Label>
              <Input id="correct_answer_text" name="correct_answer_text" value={form.correct_answer_text || ''} onChange={handleChange} placeholder="Answer text or label" />
            </div>}

            {form.type === 'mcq' && (
              <div className="space-y-3 rounded border p-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Choices</h4>
                  {!localQuestionId && (
                    <span className="text-xs text-neutral-400">Save the question first to add choices</span>
                  )}
                </div>
                <div className="space-y-2">
                  {Array.isArray(choices) && choices.length > 0 ? (
                    <ul className="space-y-2">
                      {choices
                        .slice()
                        .sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0))
                        .map((ch, idx) => {
                          const isEditing = editingChoiceId === ch.choice_id;
                          const isSelected = form.correct_answer_text === ch.text;
                          return (
                            <li key={ch.choice_id} className="flex items-center justify-between gap-3">
                              <div className="flex flex-1 items-start gap-3 min-w-0">
                                <span className="text-xs text-neutral-400 shrink-0">#{ch.order_index ?? idx + 1}</span>
                                {isEditing ? (
                                  <Input
                                    value={editingChoiceText}
                                    onChange={(e) => setEditingChoiceText(e.target.value)}
                                    className="h-8"
                                  />
                                ) : (
                                  <span className="text-sm truncate">{ch.text}</span>
                                )}
                              </div>
                              <div className="flex items-center justify-self-center gap-2 shrink-0">
                                <label className="flex items-center gap-2 select-none mr-2">
                                  <input
                                    type="checkbox"
                                    className="size-4 accent-neutral-300"
                                    checked={isSelected}
                                    onChange={(e) =>
                                      setForm(f => ({
                                        ...f,
                                        correct_answer_text: e.target.checked
                                          ? ch.text
                                          : (f.correct_answer_text === ch.text ? '' : f.correct_answer_text)
                                      }))
                                    }
                                  />
                                  <span className="text-sm">Correct</span>
                                </label>
                                {isEditing ? (
                                  <>
                                    <Button type="button" size="sm" onClick={() => handleSaveChoiceEdit(ch)} disabled={!editingChoiceText.trim()}>Save</Button>
                                    <Button type="button" size="sm" variant="ghost" onClick={() => { setEditingChoiceId(null); setEditingChoiceText(''); }}>Cancel</Button>
                                  </>
                                ) : (
                                  <>
                                    <Button type="button" size="sm" variant="outline" onClick={() => beginEditChoice(ch)}>Edit</Button>
                                    <Button type="button" size="sm" variant="destructive" onClick={() => handleDeleteChoice(ch)}>Delete</Button>
                                  </>
                                )}
                              </div>
                            </li>
                          );
                        })}
                    </ul>
                  ) : (
                      <div className="text-sm text-neutral-400">No choices yet.</div>
                  )}
                  <div className="flex items-center gap-2 pt-1">
                      <Input
                        placeholder="New choice text"
                        value={addingChoiceText}
                        onChange={(e) => setAddingChoiceText(e.target.value)}
                        disabled={!localQuestionId}
                      />
                      <Button type="button" onClick={handleAddChoice} disabled={!localQuestionId || !addingChoiceText.trim()}>Add</Button>
                  </div>
                  <p className="text-xs text-neutral-500">Use the checkbox on the right to mark the correct answer. The selection is saved when you click Save.</p>
                </div>
              </div>
            )}
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
