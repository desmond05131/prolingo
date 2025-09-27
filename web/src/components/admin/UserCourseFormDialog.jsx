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
import { ADMIN_USER_COURSE_PRIMARY_KEY } from '@/constants';
import RemoteSelect from '../ui/remote-select';
import { fetchAdminTests, fetchAdminUsers } from '@/api';

export default function UserCourseFormDialog({ open, onOpenChange, record, onSave, primaryKey = ADMIN_USER_COURSE_PRIMARY_KEY }) {
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
          <DialogTitle>
            {isCreate ? "Create User Course" : "Edit User Course"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {error && (
            <div className="text-sm text-destructive border border-destructive/40 bg-destructive/10 rounded px-3 py-2">
              {error}
            </div>
          )}
          <div className="grid gap-4">
            <div className="space-y-1">
              <Label htmlFor="username">User</Label>
            <RemoteSelect
              id="user"
              value={String(form.user ?? "")}
              onChange={(val) => setForm((f) => ({ ...f, user: val }))}
              fetcher={fetchAdminUsers}
              getValue={(u) => u.id}
              getLabel={(u) => u.username}
              placeholder="Select a user"
              enabled={open}
              disabled={!isCreate && !!record?.user}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="course">Course</Label>
              <RemoteSelect
                id="course"
                value={String(form.course ?? '')}
                onChange={(val) => setForm(f => ({ ...f, course: val }))}
                fetcher={fetchAdminTests}
                getValue={(u) => u?.course?.course_id ?? '-'}
                getLabel={(u) => u?.course?.title ?? 'N/A'}
                placeholder="Select a course"
                enabled={open}
                disabled={!isCreate && !!(record?.course)}
                />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="enrollment_date">Enrollment Date</Label>
                <Input
                  id="enrollment_date"
                  name="enrollment_date"
                  type="date"
                  value={form.enrollment_date || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-1">
                <Label>Is Dropped</Label>
                <Select
                  value={String(!!form.is_dropped)}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, is_dropped: v === "true" }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="false">No</SelectItem>
                    <SelectItem value="true">Yes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter className="pt-2">
            <DialogClose asChild>
              <Button type="button" variant="ghost" disabled={saving}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={saving}>
              {saving
                ? isCreate
                  ? "Creating..."
                  : "Saving..."
                : isCreate
                ? "Create"
                : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
