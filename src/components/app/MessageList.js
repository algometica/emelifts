'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function MessageList({ messages, currentUserId }) {
  const router = useRouter();

  useEffect(() => {
    const id = setInterval(() => router.refresh(), 8000);
    return () => clearInterval(id);
  }, [router]);

  if (messages.length === 0) {
    return (
      <p className="text-[15px] text-[#6e6e73]">No messages yet. Say hi after your first lift.</p>
    );
  }

  return (
    <div className="space-y-3">
      {messages.map((m) => {
        const mine = m.fromUserId === currentUserId;
        return (
          <div
            key={m.id}
            className={`max-w-[85%] rounded-2xl px-4 py-3 text-[15px] ${
              mine ? 'ml-auto bg-[#1d1d1f] text-white' : 'bg-[#f5f5f7] text-[#1d1d1f]'
            }`}
          >
            <p>{m.body}</p>
            <p className={`mt-1 text-[11px] ${mine ? 'text-white/50' : 'text-[#6e6e73]'}`}>
              {m.when}
            </p>
          </div>
        );
      })}
    </div>
  );
}
