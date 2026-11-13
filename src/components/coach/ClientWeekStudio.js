'use client';

import { useMemo, useState } from 'react';
import {
  coachAddExercise,
  coachAddWorkout,
  coachCustomizeClientWeek,
  coachDeleteExercise,
  coachDeleteWorkout,
  coachResetClientWeek,
  coachSaveExercise,
  coachSaveWorkout,
} from '@/app/actions';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAYS_LONG = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function Field({ label, children }) {
  return (
    <label className="block text-[13px] font-medium text-[#1d1d1f]">
      {label}
      <div className="mt-1">{children}</div>
    </label>
  );
}

export default function ClientWeekStudio({ program, userId, weeks }) {
  const [weekIndex, setWeekIndex] = useState(0);
  const [workoutId, setWorkoutId] = useState('');
  const [addOnDay, setAddOnDay] = useState(null);

  const clientWeeks = useMemo(() => {
    const set = new Set(
      (program.workouts || [])
        .filter((w) => w.userId === userId)
        .map((w) => w.weekIndex || 0)
    );
    return set;
  }, [program, userId]);

  const weekWorkouts = useMemo(() => {
    const all = program.workouts || [];
    const mine = all.filter((w) => w.userId === userId && (w.weekIndex || 0) === weekIndex);
    if (mine.length) return mine;
    const master = all.filter((w) => !w.userId && (w.weekIndex || 0) === weekIndex);
    if (master.length) return master;
    return all.filter((w) => !w.userId && (w.weekIndex || 0) === 0);
  }, [program, userId, weekIndex]);

  const weekIsClientCustom = clientWeeks.has(weekIndex);
  const workout = weekWorkouts.find((w) => w.id === workoutId) || weekWorkouts[0];

  function pickWeek(nextWeek) {
    const index = Number(nextWeek);
    setWeekIndex(index);
    setAddOnDay(null);
    setWorkoutId('');
  }

  function pickDay(dayIndex) {
    const existing = weekWorkouts.find((w) => w.dayOffset === dayIndex);
    if (existing) {
      setWorkoutId(existing.id);
      setAddOnDay(null);
      return;
    }
    if (!weekIsClientCustom) return;
    setAddOnDay(dayIndex);
  }

  return (
    <section className="card space-y-4">
      <div>
        <h2 className="text-[17px] font-semibold">This client’s week</h2>
        <p className="mt-1 text-[14px] text-[#6e6e73]">
          Change a week here for this person only. The master wedding plan stays as it is for everyone else.
        </p>
      </div>
      <label className="block text-[13px] font-medium">
        Week
        <select
          className="field mt-1 max-w-xs"
          value={weekIndex}
          onChange={(e) => pickWeek(e.target.value)}
        >
          {Array.from({ length: weeks }, (_, i) => (
            <option key={i} value={i}>
              Week {i + 1}
              {clientWeeks.has(i) ? ' · just this client' : ' · master'}
            </option>
          ))}
        </select>
      </label>

      {!weekIsClientCustom ? (
        <form action={coachCustomizeClientWeek} className="flex flex-wrap items-center gap-3 rounded-2xl bg-[#f5f5f7] px-4 py-3 text-[14px]">
          <input type="hidden" name="programId" value={program.id} />
          <input type="hidden" name="userId" value={userId} />
          <input type="hidden" name="weekIndex" value={weekIndex} />
          <p className="flex-1 text-[#6e6e73]">
            Week {weekIndex + 1} still uses the master plan.
          </p>
          <button className="btn-primary px-4">Customize for this client</button>
        </form>
      ) : (
        <form action={coachResetClientWeek}>
          <input type="hidden" name="programId" value={program.id} />
          <input type="hidden" name="userId" value={userId} />
          <input type="hidden" name="weekIndex" value={weekIndex} />
          <button className="btn-secondary">Reset week {weekIndex + 1} to master</button>
        </form>
      )}

      <div className="grid grid-cols-7 gap-1 md:gap-2">
        {DAYS.map((label, i) => {
          const dayWorkouts = weekWorkouts.filter((w) => w.dayOffset === i);
          const selected = dayWorkouts.some((w) => w.id === workout?.id) && addOnDay == null;
          return (
            <button
              key={label}
              type="button"
              onClick={() => pickDay(i)}
              className={`min-h-[72px] rounded-2xl px-1 py-2 text-center ${
                selected ? 'bg-[#1d1d1f] text-white' : 'bg-[#f5f5f7] text-[#1d1d1f]'
              }`}
            >
              <p className={`text-[11px] uppercase tracking-wide ${selected ? 'text-white/60' : 'text-[#6e6e73]'}`}>
                {label}
              </p>
              {dayWorkouts.length ? (
                dayWorkouts.map((w) => (
                  <p key={w.id} className="mt-1 text-[12px] font-medium leading-tight">
                    {w.name}
                  </p>
                ))
              ) : (
                <p className={`mt-2 text-[12px] ${selected ? 'text-white/50' : 'text-[#aeaeb2]'}`}>Rest</p>
              )}
            </button>
          );
        })}
      </div>

      {addOnDay != null && weekIsClientCustom ? (
        <form action={coachAddWorkout} className="grid gap-3 md:grid-cols-2">
          <input type="hidden" name="programId" value={program.id} />
          <input type="hidden" name="userId" value={userId} />
          <input type="hidden" name="weekIndex" value={weekIndex} />
          <input type="hidden" name="dayOffset" value={addOnDay} />
          <p className="text-[15px] font-semibold md:col-span-2">
            New session · {DAYS_LONG[addOnDay]}
          </p>
          <Field label="Title">
            <input name="name" required className="field" />
          </Field>
          <Field label="Minutes">
            <input name="durationMin" type="number" defaultValue={40} className="field" />
          </Field>
          <button className="btn-primary">Add session</button>
          <button type="button" className="btn-secondary" onClick={() => setAddOnDay(null)}>
            Cancel
          </button>
        </form>
      ) : null}

      {workout && addOnDay == null && weekIsClientCustom ? (
        <div key={workout.id}>
          <form action={coachSaveWorkout} className="grid gap-3 md:grid-cols-3">
            <input type="hidden" name="id" value={workout.id} />
            <Field label="Title">
              <input name="name" defaultValue={workout.name} required className="field" />
            </Field>
            <Field label="Weekday">
              <select name="dayOffset" defaultValue={String(workout.dayOffset)} className="field">
                {DAYS_LONG.map((day, i) => (
                  <option key={day} value={i}>
                    {day}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Minutes">
              <input name="durationMin" type="number" defaultValue={workout.durationMin} className="field" />
            </Field>
            <div className="md:col-span-3">
              <Field label="Note">
                <input name="notes" defaultValue={workout.notes} className="field" />
              </Field>
            </div>
            <button className="btn-secondary justify-self-start">Save day</button>
          </form>
          <form
            action={coachDeleteWorkout}
            className="mt-2"
            onSubmit={(e) => {
              if (!window.confirm('Remove this day for this client?')) e.preventDefault();
            }}
          >
            <input type="hidden" name="id" value={workout.id} />
            <button className="btn-danger btn-sm">Remove day</button>
          </form>
          <ul className="mt-4 divide-y divide-black/[0.06]">
            {workout.exercises.map((e) => (
              <li key={e.id} className="py-3">
                <form action={coachSaveExercise} className="grid items-end gap-3 md:grid-cols-[1fr_5rem_6rem_6rem_auto]">
                  <input type="hidden" name="id" value={e.id} />
                  <Field label="Exercise">
                    <input name="name" defaultValue={e.name} required className="field" />
                  </Field>
                  <Field label="Sets">
                    <input name="sets" type="number" defaultValue={e.sets} className="field" />
                  </Field>
                  <Field label="Reps">
                    <input name="reps" defaultValue={e.reps} className="field" />
                  </Field>
                  <Field label="Rest s">
                    <input name="restSec" type="number" defaultValue={e.restSec} className="field" />
                  </Field>
                  <div className="flex items-center gap-3 pb-1">
                    <button className="btn-primary btn-sm px-4">Save</button>
                    <button formAction={coachDeleteExercise} className="btn-danger btn-sm">
                      Remove
                    </button>
                  </div>
                </form>
              </li>
            ))}
          </ul>
          <form action={coachAddExercise} className="mt-4">
            <input type="hidden" name="workoutId" value={workout.id} />
            <div className="grid gap-3 md:grid-cols-[1fr_5rem_6rem_6rem]">
              <Field label="Exercise">
                <input name="name" required placeholder="Goblet squat" className="field" />
              </Field>
              <Field label="Sets">
                <input name="sets" type="number" defaultValue={3} className="field" />
              </Field>
              <Field label="Reps">
                <input name="reps" defaultValue="8-10" className="field" />
              </Field>
              <Field label="Rest s">
                <input name="restSec" type="number" defaultValue={90} className="field" />
              </Field>
            </div>
            <button className="btn-primary mt-3">Add lift</button>
          </form>
        </div>
      ) : null}

      {workout && !weekIsClientCustom ? (
        <p className="text-[14px] text-[#6e6e73]">
          {workout.name}: {workout.exercises.map((e) => e.name).join(', ') || 'no lifts'}
        </p>
      ) : null}
    </section>
  );
}
