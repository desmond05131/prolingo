import React, { useState } from 'react';

// Row 4: Password change (current + new)
export function PasswordChangeForm({ onChange }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handle = (field, value) => {
    if (field === 'current') setCurrentPassword(value);
    if (field === 'new') setNewPassword(value);
    onChange?.({ currentPassword: field === 'current' ? value : currentPassword, newPassword: field === 'new' ? value : newPassword });
  };

  return (
    <div className="w-full p-6 rounded-lg bg-secondary text-secondary-foreground shadow flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Change Password</h2>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Current Password</label>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => handle('current', e.target.value)}
          className="w-full rounded-md bg-white text-background px-3 py-2 text-sm"
          placeholder="••••••••"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">New Password</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => handle('new', e.target.value)}
          className="w-full rounded-md bg-white text-background px-3 py-2 text-sm"
          placeholder="New password"
        />
      </div>
    </div>
  );
}
