'use client';

import { useState } from 'react';
import { changePassword } from '@/app/actions';

export default function ChangePasswordForm() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    setMessage('');
    setError('');
    const result = await changePassword(new FormData(e.currentTarget));
    if (result?.error) setError(result.error);
    else {
      setMessage('Password updated.');
      e.currentTarget.reset();
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-3 rounded-[22px] bg-[#f5f5f7] p-5">
      <h2 className="text-[17px] font-semibold">Change password</h2>
      <input
        name="current"
        type="password"
        required
        placeholder="Current"
        className="h-11 w-full rounded-xl border border-black/[0.1] px-3"
      />
      <input
        name="next"
        type="password"
        required
        minLength={8}
        placeholder="New (8+ characters)"
        className="h-11 w-full rounded-xl border border-black/[0.1] px-3"
      />
      {error ? <p className="text-[14px] text-[#9B3B1A]">{error}</p> : null}
      {message ? <p className="text-[14px] text-[#1d1d1f]">{message}</p> : null}
      <button type="submit" className="btn-primary">
        Update password
      </button>
    </form>
  );
}
