export default function HabitGrid({ habits, days, doneSet, todayKey }) {
  if (!habits.length) {
    return (
      <p className="text-[15px] text-[#6e6e73]">
        Habits show up here after you tick them on Today.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="space-y-3">
        <div
          className="grid items-end gap-1"
          style={{ gridTemplateColumns: `minmax(8.5rem,1.4fr) repeat(${days.length}, minmax(1.4rem,1fr))` }}
        >
          <span />
          {days.map((day) => (
            <span
              key={day.key}
              className={`text-center text-[10px] ${
                day.key === todayKey ? 'font-semibold text-[#1d1d1f]' : 'text-[#6e6e73]'
              }`}
            >
              {day.label}
            </span>
          ))}
        </div>
        {habits.map((habit) => (
          <div
            key={habit.id}
            className="grid items-center gap-1"
            style={{ gridTemplateColumns: `minmax(8.5rem,1.4fr) repeat(${days.length}, minmax(1.4rem,1fr))` }}
          >
            <div className="pr-2">
              <p className="truncate text-[13px] font-medium text-[#1d1d1f]">{habit.name}</p>
              <p className="text-[11px] text-[#6e6e73]">
                {habit.streak ? `${habit.streak} day streak` : 'No streak yet'}
              </p>
            </div>
            {days.map((day) => {
              const on = doneSet.has(`${habit.id}:${day.key}`);
              return (
                <span
                  key={day.key}
                  title={`${habit.name} · ${day.key}`}
                  className={`mx-auto block h-4 w-4 rounded-full ${
                    on
                      ? 'bg-[#1d1d1f]'
                      : day.key === todayKey
                        ? 'border border-[#1d1d1f]/40 bg-white'
                        : 'bg-[#ececee]'
                  }`}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
