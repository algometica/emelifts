'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function WaitingRefresh() {
  const router = useRouter();

  useEffect(() => {
    const id = setInterval(() => router.refresh(), 4000);
    return () => clearInterval(id);
  }, [router]);

  return (
    <p className="mt-4 text-[13px] text-[#6e6e73]">Checking payment status…</p>
  );
}
