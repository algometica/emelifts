'use client';

import { useState } from 'react';
import { NAV } from '../lib/nav';

export default function MobileMenu({ enrollUrl, formUrl }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex min-h-[44px] min-w-[44px] items-center justify-center text-[#1d1d1f] md:hidden"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        aria-controls="mobile-nav"
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          {open ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden" id="mobile-nav">
          <button type="button" className="absolute inset-0 bg-black/20" onClick={close} aria-label="Dismiss" />
          <div className="absolute right-0 top-0 flex h-full w-[min(100%,20rem)] flex-col border-l border-black/[0.08] bg-white pt-[env(safe-area-inset-top)] shadow-xl">
            <div className="flex items-center justify-between border-b border-black/[0.08] px-4 py-3">
              <span className="text-[15px] font-semibold text-[#1d1d1f]">Menu</span>
              <button
                type="button"
                onClick={close}
                className="flex min-h-[44px] min-w-[44px] items-center justify-center text-[#6e6e73]"
                aria-label="Close"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-2 py-2" aria-label="Mobile">
              {NAV.map(({ href, label, emphasize }) => (
                <a
                  key={href}
                  href={href}
                  onClick={close}
                  className={`flex min-h-[44px] items-center rounded-lg px-3 text-[17px] text-[#1d1d1f] active:bg-[#f5f5f7] ${emphasize ? 'font-semibold' : ''}`}
                >
                  {label}
                </a>
              ))}
            </nav>

            <div className="border-t border-black/[0.08] p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <a
                href={enrollUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={close}
                className="btn-primary mb-3 w-full text-center"
              >
                Enroll
              </a>
              <a
                href={formUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={close}
                className="btn-secondary w-full text-center text-[17px]"
              >
                Message Em
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
