import React, { useEffect, useState } from 'react';

// Row 2: Name + Email form card
export function ProfileDetailsForm({ profile, onChange }) {
  const [name, setName] = useState(profile?.name || '');
  const [email, setEmail] = useState(profile?.email || '');

  const handleChange = (field, value) => {
    if (field === 'name') setName(value);
    if (field === 'email') setEmail(value);
    onChange?.({ name: field === 'name' ? value : name, email: field === 'email' ? value : email });
  };

  useEffect(() => {
    setName(profile?.name || '');
    setEmail(profile?.email || '');
  }, [profile?.name, profile?.email]);

  return (
    <div className="w-full p-6 rounded-lg bg-secondary text-secondary-foreground shadow flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Profile Information</h2>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Username</label>
        <input
          value={name}
          onChange={(e) => handleChange('name', e.target.value)}
          className="w-full rounded-md bg-white text-background px-3 py-2 text-sm"
          placeholder="Your username"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => handleChange('email', e.target.value)}
          className="w-full rounded-md bg-white text-background px-3 py-2 text-sm"
          placeholder="you@example.com"
        />
      </div>
    </div>
  );
}
