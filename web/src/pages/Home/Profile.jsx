import React, { useState } from 'react';
import { Sidebar } from "../../components/Sidebar/Sidebar";
import { ProfileBanner } from '../../components/Profile/ProfileBanner';
import { ProfileDetailsForm } from '../../components/Profile/ProfileDetailsForm';
import { AvatarUpload } from '../../components/Profile/AvatarUpload';
import { PasswordChangeForm } from '../../components/Profile/PasswordChangeForm';
import { SubscriptionSection } from '../../components/Profile/SubscriptionSection';
import { MOCK_PROFILE } from '../../constants';
import "../../styles/Home.css";

function ProfileHome() {
  // Local draft state collecting edits
  const [draft, setDraft] = useState({
    name: MOCK_PROFILE.name,
    email: MOCK_PROFILE.email,
    avatar: MOCK_PROFILE.avatarUrl,
    currentPassword: '',
    newPassword: '',
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      // TODO: integrate real API call
      await new Promise(r => setTimeout(r, 800));
      setMessage({ type: 'success', text: 'Profile saved.' });
    } catch {
      setMessage({ type: 'error', text: 'Failed to save profile.' });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setDraft({
      name: MOCK_PROFILE.name,
      email: MOCK_PROFILE.email,
      avatar: MOCK_PROFILE.avatarUrl,
      currentPassword: '',
      newPassword: '',
    });
    setMessage({ type: 'info', text: 'Changes discarded.' });
  };

  return (
    <div className="flex flex-row h-full w-full">
      <Sidebar />
      <main className="flex-1 max-h-screen px-8 py-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto flex flex-col gap-8">
          <ProfileBanner
            profile={{
              ...MOCK_PROFILE,
              name: draft.name,
              avatarUrl: draft.avatar,
            }}
          />
          <ProfileDetailsForm
            profile={{ name: draft.name, email: draft.email }}
            onChange={(v) => setDraft((d) => ({ ...d, ...v }))}
          />
          <AvatarUpload
            profile={{ avatarUrl: draft.avatar }}
            onChange={(file, dataUrl) =>
              setDraft((d) => ({ ...d, avatar: dataUrl }))
            }
          />
          <PasswordChangeForm
            onChange={(v) => setDraft((d) => ({ ...d, ...v }))}
          />
          {/* <SubscriptionSection /> */}
          <div className="flex justify-end gap-3 pb-8">
            <button
              type="button"
              onClick={handleCancel}
              className="px-5 py-2 rounded-md bg-gray-400 text-secondary-foreground text-sm font-medium hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={handleSave}
              className="px-5 py-2 rounded-md bg-primary disabled:opacity-60 text-white text-sm font-medium hover:bg-primary-600"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
          {message && (
            <div
              className={`text-sm ${
                message.type === "error"
                  ? "text-red-600"
                  : message.type === "success"
                  ? "text-green-600"
                  : "text-gray-600"
              }`}
            >
              {message.text}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default ProfileHome;
