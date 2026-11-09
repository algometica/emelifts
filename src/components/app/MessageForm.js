'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { sendMessage } from '@/app/actions';

export default function MessageForm({ toUserId, placeholder = 'Message Em' }) {
  const router = useRouter();
  const [body, setBody] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setSending(true);
    const res = await sendMessage(toUserId, body);
    setSending(false);
    if (res?.error) {
      setError(res.error);
      return;
    }
    setBody('');
    setError('');
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="flex gap-2">
      <input
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder={placeholder}
        maxLength={2000}
        className="h-12 flex-1 rounded-full border border-black/[0.1] px-4 text-[16px]"
      />
      <button type="submit" disabled={sending} className="btn-primary px-5">
        {sending ? '…' : 'Send'}
      </button>
      {error ? (
        <p className="basis-full text-[13px] text-[#9B3B1A]">{error}</p>
      ) : null}
    </form>
  );
}
