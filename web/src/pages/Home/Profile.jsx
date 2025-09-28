import React, { useEffect, useMemo, useState } from 'react';
import { Sidebar } from "../../components/Sidebar/Sidebar";
import { ProfileBanner } from '../../components/Profile/ProfileBanner';
import { ProfileDetailsForm } from '../../components/Profile/ProfileDetailsForm';
import { AvatarUpload } from '../../components/Profile/AvatarUpload';
import { PasswordChangeForm } from '../../components/Profile/PasswordChangeForm';
import { listAchievements, listUserClaimedAchievements, getMyProfile, updateMyProfile } from '../../client-api';
import LoadingIndicator from '../../components/LoadingIndicator';
import { useToast } from '../../hooks/use-toast';
import "../../styles/Home.css";
import { refreshStats } from '@/stores/stores';

function ProfileHome() {
  const { toast } = useToast();
  // Local draft state aligning with backend schema fields
  // username, email, profile_icon
  const [draft, setDraft] = useState({
    username: '',
    email: '',
    profile_icon: '',
    currentPassword: '',
    newPassword: '',
  });
  const [profile, setProfile] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [claimedAchievements, setClaimedAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  // Fetch current profile on mount
  useEffect(() => {
    let active = true;
    const ctrl = new AbortController();
    (async () => {
      setLoading(true);
      try {
        // Fetch profile and achievements in parallel
        const [data, ach, claimed] = await Promise.all([
          getMyProfile(ctrl.signal),
          listAchievements(ctrl.signal).catch(() => []),
          listUserClaimedAchievements(ctrl.signal).catch(() => []),
        ]);
        if (!active) return;
        setProfile(data);
        setAchievements(Array.isArray(ach) ? ach : (ach?.results || []));
        setClaimedAchievements(Array.isArray(claimed) ? claimed : (claimed?.results || []));
        setDraft((d) => ({
          ...d,
          username: data?.username || '',
          email: data?.email || '',
          profile_icon: data?.profile_icon || '',
        }));
      } catch {
        if (!active) return;
        setMessage({ type: 'error', text: 'Failed to load profile.' });
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
      ctrl.abort();
    };
  }, []);

  const bannerBadges = useMemo(() => {
    // Map only CLAIMED achievements to banner badge model when reward_type === 'badge'
    const baseUrl = (import.meta.env?.VITE_API_URL || '').replace(/\/$/, '');
    const claimedIdSet = new Set((claimedAchievements || []).map((c) => c?.achievement_id));
    return (achievements || [])
      .filter((a) => a?.reward_type === 'badge' && claimedIdSet.has(a?.achievement_id))
      .map((a) => ({
        id: a.achievement_id ?? `${a.reward_type}-${a.reward_content}`,
        imageUrl: a.reward_content
          ? (a.reward_content.startsWith('http') ? a.reward_content : `${baseUrl}${a.reward_content.startsWith('/') ? '' : '/'}${a.reward_content}`)
          : '',
        label: a.reward_content_description || 'Badge',
        color: '#89b4fa',
      }));
  }, [achievements, claimedAchievements]);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const payload = {};
      if (draft.username && draft.username !== profile?.username) payload.username = draft.username;
      if (draft.email && draft.email !== profile?.email) payload.email = draft.email;
      // Avatar currently expects string URL or data URL; backend field is profile_icon
      if (draft.profile_icon && draft.profile_icon !== profile?.profile_icon) payload.profile_icon = draft.profile_icon;

      // Inline password change via PATCH if both provided
      if (draft.currentPassword && draft.newPassword) {
        payload.current_password = draft.currentPassword;
        payload.password = draft.newPassword;
      }

      if (Object.keys(payload).length > 0) {
        try {
          await updateMyProfile(payload);
        } catch (err) {
          // Fallback: some backends may expect `password` instead of `new_password`
          const hadNewPassword = Object.prototype.hasOwnProperty.call(payload, 'new_password');
          if (!hadNewPassword) throw err;

          const altPayload = { ...payload };
          delete altPayload.new_password;
          altPayload.password = draft.newPassword;
          await updateMyProfile(altPayload);
        }
      }

      // refresh profile
      const fresh = await getMyProfile();
      setProfile(fresh);
      setDraft((d) => ({
        ...d,
        username: fresh?.username || d.username,
        email: fresh?.email || d.email,
        profile_icon: fresh?.profile_icon || d.profile_icon,
        currentPassword: '',
        newPassword: '',
      }));

      // refresh state
      refreshStats().catch(() => { });
      
      setMessage({ type: 'success', text: 'Profile saved.' });
      toast.success?.('Profile saved.') || toast('Profile saved.');
    } catch (err) {
      const msg = err?.message || 'Failed to save profile.';
      setMessage({ type: 'error', text: msg });
      // Show toast on submit error
      toast.error?.(msg) || toast(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setDraft({
        username: profile?.username || '',
        email: profile?.email || '',
        profile_icon: profile?.profile_icon || '',
        currentPassword: '',
        newPassword: '',
      });
    }
    setMessage({ type: 'info', text: 'Changes discarded.' });
  };

  return (
    <div className="flex flex-row h-full w-full">
      <Sidebar />
      <main className="flex-1 max-h-screen px-8 py-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto flex flex-col gap-8">
          {loading ? (
            <div className="flex items-center gap-3 text-white/80"><LoadingIndicator /> Loading profile…</div>
          ) : (
            <ProfileBanner
              profile={{
                username: draft.username,
                profile_icon: draft.profile_icon,
              }}
              badges={bannerBadges}
            />
          )}
          <ProfileDetailsForm
            profile={{ name: draft.username, email: draft.email }}
            onChange={(v) => setDraft((d) => ({ ...d, username: v.name, email: v.email }))}
          />
          <AvatarUpload
            avatarUrl={draft.profile_icon}
            username={draft.username}
            onChange={(file, dataUrl) => setDraft((d) => ({ ...d, profile_icon: dataUrl || d.profile_icon }))}
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
