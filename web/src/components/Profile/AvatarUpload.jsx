import React, { useRef, useState } from 'react';
import { MOCK_PROFILE } from '../../constants';

// Row 3: Avatar preview + upload/reupload
export function AvatarUpload({ profile = MOCK_PROFILE, onChange }) {
  const [preview, setPreview] = useState(profile.avatarUrl);
  const inputRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
      onChange?.(file, e.target.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full p-6 rounded-lg bg-secondary text-secondary-foreground shadow border border-secondary-200 flex items-center gap-6">
      <div className="h-28 w-28 rounded-full overflow-hidden bg-gray-100 ring-2 ring-gray-200 flex items-center justify-center">
        {/* avatar preview */}
        <img src={preview} alt="avatar" className="h-full w-full object-cover" />
      </div>
      <div className="flex flex-col gap-3">
        <span className="text-sm">Upload a square image for best results (PNG/JPG).</span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="px-4 py-2 rounded-md bg-primary text-sm font-medium hover:bg-primary-600"
          >
            Upload
          </button>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>
    </div>
  );
}
