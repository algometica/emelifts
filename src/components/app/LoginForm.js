'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { safeNextPath } from '@/lib/safe';

export default function LoginForm({ nextPath }) {
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setPending(true);
    const form = new FormData(e.currentTarget);
    const result = await signIn('credentials', {
      email: form.get('email'),
      password: form.get('password'),
      redirect: false,
    });
    setPending(false);
    if (result?.error) {
      setError('Email or password is wrong.');
      return;
    }
    window.location.href = safeNextPath(nextPath) || '/app';
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-4">
      <label className="block text-[13px] font-medium text-[#1d1d1f]">
        Email
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          maxLength={254}
          className="field mt-1"
        />
      </label>
      <label className="block text-[13px] font-medium text-[#1d1d1f]">
        Password
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          maxLength={200}
          className="field mt-1"
        />
      </label>
      {error ? <p className="text-[14px] text-[#9B3B1A]">{error}</p> : null}
      <button type="submit" disabled={pending} className="btn-primary w-full">
        {pending ? 'Signing in…' : 'Log in'}
      </button>
      <p className="text-center text-[13px] text-[#6e6e73]">
        New here?{' '}
        <a href="/enroll" className="font-medium text-[#0066cc]">
          Enroll
        </a>
      </p>
    </form>
  );
}
