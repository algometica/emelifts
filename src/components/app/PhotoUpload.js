'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function PhotoUpload() {
  const router = useRouter();
  const [status, setStatus] = useState('');

  async function onChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const data = new FormData();
    data.set('file', file);
    setStatus('Uploading…');
    const res = await fetch('/api/upload', { method: 'POST', body: data });
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      setStatus(json.error || 'Upload failed');
      return;
    }
    setStatus('Saved');
    router.refresh();
  }

  return (
    <label className="block">
      <span className="btn-secondary">Add a dated photo</span>
      <input type="file" accept="image/*" className="sr-only" onChange={onChange} />
      {status ? <p className="mt-1 text-[13px] text-[#6e6e73]">{status}</p> : null}
    </label>
  );
}
