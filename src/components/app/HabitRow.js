'use client';

import { toggleHabit } from '@/app/actions';

export default function HabitRow({ habit, date, done }) {
  return (
    <form action={toggleHabit.bind(null, habit.id, date)}>
      <button
        type="submit"
        className="flex min-h-[48px] w-full items-center justify-between rounded-2xl bg-[#f5f5f7] px-4 text-left"
      >
        <span className="text-[15px] text-[#1d1d1f]">{habit.name}</span>
        <span
          className={`flex h-6 w-6 items-center justify-center rounded-full border ${
            done ? 'border-[#1d1d1f] bg-[#1d1d1f] text-white' : 'border-black/20'
          }`}
        >
          {done ? '✓' : ''}
        </span>
      </button>
    </form>
  );
}
