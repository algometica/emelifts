export default function WeekStrip({ days, selected, scheduledKeys }) {
  const scheduled = new Set(scheduledKeys);

  return (
    <div className="-mx-1 mb-5 flex gap-1 overflow-x-auto pb-1 md:gap-2">
      {days.map((day) => {
        const selectedDay = day.key === selected;
        return (
          <a
            key={day.key}
            href={`/app?date=${day.key}`}
            className={`flex min-h-[72px] min-w-[52px] flex-1 flex-col items-center justify-center rounded-2xl px-1 text-center md:min-h-[88px] ${
              selectedDay ? 'bg-[#1d1d1f] text-white' : 'bg-[#f5f5f7] text-[#1d1d1f]'
            }`}
          >
            <span className="text-[11px] uppercase tracking-wide opacity-70">{day.label}</span>
            <span className="text-[18px] font-semibold">{day.dayNum}</span>
            <span
              className={`mt-1 h-1.5 w-1.5 rounded-full ${
                scheduled.has(day.key)
                  ? selectedDay
                    ? 'bg-white'
                    : 'bg-[#1d1d1f]'
                  : 'bg-transparent'
              }`}
            />
          </a>
        );
      })}
    </div>
  );
}
