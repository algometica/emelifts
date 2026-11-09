import AppNav from './AppNav';

export default function AppShell({ children, title, subtitle }) {
  return (
    <div className="min-h-[100dvh] bg-[#f5f5f7] md:bg-[#f5f5f7]">
      <div className="mx-auto flex min-h-[100dvh] max-w-none flex-col bg-white md:max-w-[1200px] md:flex-row md:bg-transparent md:px-6 md:py-8">
        <AppNav />
        <div className="flex min-w-0 flex-1 flex-col bg-white md:rounded-[24px] md:shadow-[0_12px_40px_rgba(0,0,0,0.06)]">
          <header className="sticky top-0 z-20 border-b border-black/[0.06] bg-white/90 px-5 pb-3 pt-[max(1rem,env(safe-area-inset-top))] backdrop-blur md:rounded-t-[24px] md:px-8 md:pt-6">
            <p className="text-[12px] font-medium uppercase tracking-[0.06em] text-[#6e6e73]">
              {subtitle || 'Emelifts'}
            </p>
            <h1 className="text-[22px] font-semibold tracking-tight text-[#1d1d1f] md:text-[28px]">
              {title}
            </h1>
          </header>
          <main className="flex-1 px-5 pb-28 pt-4 md:px-8 md:pb-10 md:pt-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
