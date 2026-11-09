'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TABS = [
  { href: '/app', label: 'Today', match: (p) => p === '/app' || p.startsWith('/app/workout') },
  { href: '/app/progress', label: 'Progress', match: (p) => p.startsWith('/app/progress') },
  { href: '/app/messages', label: 'Messages', match: (p) => p.startsWith('/app/messages') },
  { href: '/app/profile', label: 'Profile', match: (p) => p.startsWith('/app/profile') },
];

export default function AppNav() {
  const pathname = usePathname() || '/app';

  return (
    <>
      <nav
        className="hidden w-56 shrink-0 flex-col border-r border-black/[0.06] bg-white px-4 py-8 md:flex"
        aria-label="Member"
      >
        <p className="px-3 text-[12px] font-medium uppercase tracking-[0.06em] text-[#6e6e73]">
          Emelifts
        </p>
        <div className="mt-6 flex flex-col gap-1">
          {TABS.map((tab) => {
            const active = tab.match(pathname);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex min-h-[44px] items-center rounded-xl px-3 text-[15px] ${
                  active ? 'bg-[#1d1d1f] font-medium text-white' : 'text-[#6e6e73] hover:bg-[#f5f5f7] hover:text-[#1d1d1f]'
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>
      </nav>

      <nav
        className="fixed bottom-0 left-0 right-0 z-30 flex justify-around border-t border-black/[0.08] bg-white/95 pb-[max(0.6rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur md:hidden"
        aria-label="Member"
      >
        {TABS.map((tab) => {
          const active = tab.match(pathname);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex min-h-[44px] min-w-[64px] flex-col items-center justify-center text-[11px] font-medium ${
                active ? 'text-[#1d1d1f]' : 'text-[#6e6e73]'
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
