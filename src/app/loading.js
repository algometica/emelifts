export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-2xl font-bold gradient-text">Loading Emelifts...</h2>
        <p className="text-gray-400 mt-2">Preparing your fitness journey</p>
      </div>
    </div>
  );
}
