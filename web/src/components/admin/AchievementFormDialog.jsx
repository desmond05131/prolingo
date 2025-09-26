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
import { ADMIN_ACHIEVEMENT_PRIMARY_KEY } from '@/constants';
import { Card, CardContent, CardHeader } from '../ui/card';

/**
 * AchievementFormDialog
 * Handles both create & edit for achievement records.
 * Fields (nullable allowed):
 *  achievement_id (PK)
 *  target_xp_value
 *  target_streak_value
 *  target_completed_test_id
 *  reward_type (xp | energy | badge)
 *  reward_amount
 *  reward_content (badge slug)
 *  reward_content_description
 */
export function AchievementFormDialog({ open, onOpenChange, record, onSave, primaryKey = ADMIN_ACHIEVEMENT_PRIMARY_KEY }) {
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

  const setField = (name, value) => setForm(f => ({ ...f, [name]: value }));

  const handleNumberChange = (name) => (e) => {
    const v = e.target.value;
    setField(name, v === '' ? '' : Number(v));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = { ...form };
      // empty string -> null for nullable numeric/text fields
      ['target_xp_value','target_streak_value','target_completed_test_id','reward_amount','reward_content','reward_content_description'].forEach(k => {
        if (payload[k] === '') payload[k] = null;
      });
      const maybe = onSave?.(payload);
      if (maybe && typeof maybe.then === 'function') await maybe;
      onOpenChange(false);
    } catch (err) {
      setError(err?.message || 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const showBadgeFields = form.reward_type === 'badge';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{isCreate ? 'Create Achievement' : 'Edit Achievement'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          {error && (
            <div className="text-sm text-destructive border border-destructive/40 bg-destructive/10 rounded px-3 py-2">{error}</div>
          )}
          <div className="grid gap-4 grid-cols-2">
            <Card className="md:col-span-2">
              <CardHeader className="font-bold">Conditions <span className="text-xs text-destructive">(require at least one)</span></CardHeader>
              <CardContent className="flex flex-row gap-4">
                <div className="flex-1 space-y-1">
                  <Label>Target XP</Label>
                  <Input type="number" min="0" value={form.target_xp_value ?? ''} onChange={handleNumberChange('target_xp_value')} placeholder="e.g. 500" />
                </div>
                <span className="text-xs align-middle self-center">or</span>
                <div className="flex-1 space-y-1">
                  <Label>Target Streak</Label>
                  <Input type="number" min="0" value={form.target_streak_value ?? ''} onChange={handleNumberChange('target_streak_value')} placeholder="e.g. 7" />
                </div>
                <span className="text-xs align-middle self-center">or</span>
                <div className="flex-1 space-y-1 md:col-span-2">
                  <Label>Target Completed Test Id</Label>
                  <Input value={form.target_completed_test_id ?? ''} onChange={(e) => setField('target_completed_test_id', e.target.value)} placeholder="test_101" />
                </div>
              </CardContent>
            </Card>
            <Card className="md:col-span-2">
              <CardHeader className="font-bold">Rewards</CardHeader>
              <CardContent className="flex flex-row gap-4">
                <div className="flex-1 space-y-1">
                  <Label>Reward Type</Label>
                  <Select value={form.reward_type} onValueChange={(v) => setField('reward_type', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select reward" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="xp">XP</SelectItem>
                      <SelectItem value="energy">Energy</SelectItem>
                      <SelectItem value="badge">Badge</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {form.reward_type !== 'badge' && (
                  <div className="flex-1 space-y-1">
                    <Label>Reward Amount</Label>
                    <Input type="number" min="0" value={form.reward_amount ?? ''} onChange={handleNumberChange('reward_amount')} placeholder="e.g. 100" />
                  </div>
                )}
                {showBadgeFields && (
                  <>
                    <div className="flex-1 space-y-1">
                      <Label>Badge Icon Url</Label>
                      <Input value={form.reward_content ?? ''} onChange={(e) => setField('reward_content', e.target.value)} placeholder="early_bird" />
                    </div>
                    <div className="flex-2 space-y-1 md:col-span-2">
                      <Label>Badge Description</Label>
                      <Input value={form.reward_content_description ?? ''} onChange={(e) => setField('reward_content_description', e.target.value)} placeholder="Awarded for ..." />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
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

export default AchievementFormDialog;