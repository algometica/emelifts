'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { editMessage } from '@/app/actions';
import { canEditMessage } from '@/lib/messages';

export default function MessageList({ messages, currentUserId }) {
  const router = useRouter();
  const [editingId, setEditingId] = useState('');
  const [draft, setDraft] = useState('');
  const [error, setError] = useState('');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    if (editingId) return undefined;
    const id = setInterval(() => router.refresh(), 8000);
    return () => clearInterval(id);
  }, [router, editingId]);

  async function save(id) {
    setError('');
    const res = await editMessage(id, draft);
    if (res?.error) {
      setError(res.error);
      return;
    }
    setEditingId('');
    router.refresh();
  }

  if (messages.length === 0) {
    return (
      <p className="text-[15px] text-[#6e6e73]">No messages yet. Say hi after your first lift.</p>
    );
  }

  return (
    <div className="space-y-3">
      {messages.map((m) => {
        const mine = m.fromUserId === currentUserId;
        const editable = ready && mine && canEditMessage(m.createdAt);
        const editing = editingId === m.id && editable;
        return (
          <div
            key={m.id}
            className={`max-w-[85%] rounded-2xl px-4 py-3 text-[15px] ${
              mine ? 'ml-auto bg-[#1d1d1f] text-white' : 'bg-[#f5f5f7] text-[#1d1d1f]'
            }`}
          >
            {editing ? (
              <div className="space-y-2">
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  maxLength={2000}
                  rows={3}
                  className="w-full rounded-xl bg-white px-3 py-2 text-[15px] text-[#1d1d1f]"
                />
                <div className="flex flex-wrap gap-2">
                  <button type="button" className="btn-primary-dark btn-sm" onClick={() => save(m.id)}>
                    Save
                  </button>
                  <button type="button" className="btn-secondary btn-sm" onClick={() => setEditingId('')}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p>{m.body}</p>
                <p className={`mt-1 text-[11px] ${mine ? 'text-white/50' : 'text-[#6e6e73]'}`}>
                  {m.when}
                  {m.edited ? ' · edited' : ''}
                </p>
                {editable ? (
                  <button
                    type="button"
                    className={`btn-sm mt-2 ${mine ? 'btn-primary-dark' : 'btn-secondary'}`}
                    onClick={() => {
                      setEditingId(m.id);
                      setDraft(m.body);
                      setError('');
                    }}
                  >
                    Edit
                  </button>
                ) : null}
              </>
            )}
          </div>
        );
      })}
      {error ? <p className="text-[13px] text-[#9B3B1A]">{error}</p> : null}
    </div>
  );
}
