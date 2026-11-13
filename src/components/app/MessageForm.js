'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { sendMessage, undoMessage } from '@/app/actions';
import { UNDO_WINDOW_MS } from '@/lib/messages';

export default function MessageForm({ toUserId, placeholder = 'Message Em' }) {
  const router = useRouter();
  const [body, setBody] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const [undoId, setUndoId] = useState('');

  useEffect(() => {
    if (!undoId) return undefined;
    const id = setTimeout(() => setUndoId(''), UNDO_WINDOW_MS);
    return () => clearTimeout(id);
  }, [undoId]);

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
    setUndoId(res?.id || '');
    router.refresh();
  }

  async function undo() {
    if (!undoId) return;
    const res = await undoMessage(undoId);
    setUndoId('');
    if (res?.error) setError(res.error);
    router.refresh();
  }

  return (
    <div>
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
      </form>
      {undoId ? (
        <button type="button" onClick={undo} className="btn-secondary btn-sm mt-2">
          Undo send
        </button>
      ) : null}
      {error ? <p className="mt-2 text-[13px] text-[#9B3B1A]">{error}</p> : null}
    </div>
  );
}
