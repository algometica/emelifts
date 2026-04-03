export default function Loading() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div
          className="w-10 h-10 border-2 border-[#1d1d1f] border-t-transparent rounded-full animate-spin mx-auto mb-4"
          aria-hidden="true"
        />
        <p className="text-[15px] text-[#6e6e73]">Loading…</p>
      </div>
    </div>
  );
}
