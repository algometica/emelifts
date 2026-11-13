import { signOutAction } from '@/app/sign-out';

export default function CoachShell({ title, subtitle, children }) {
  return (
    <div className="min-h-[100dvh] bg-[#f5f5f7]">
      <div className="mx-auto max-w-4xl px-5 py-8 md:px-8 md:py-10">
        <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-[#6e6e73]">
              Coach
            </p>
            <h1 className="mt-1 text-[28px] font-semibold tracking-tight md:text-[32px]">
              {title}
            </h1>
            {subtitle ? (
              <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-[#6e6e73]">
                {subtitle}
              </p>
            ) : null}
          </div>
          <nav className="flex flex-wrap items-center gap-4 text-[14px]">
            <a href="/coach" className="text-[#0066cc]">
              Clients
            </a>
            <a href="/coach/programs" className="text-[#0066cc]">
              Programs
            </a>
            <a href="/coach/account" className="text-[#0066cc]">
              Account
            </a>
            <form action={signOutAction}>
              <button type="submit" className="btn-secondary btn-sm">
                Sign out
              </button>
            </form>
          </nav>
        </header>
        {children}
      </div>
    </div>
  );
}
