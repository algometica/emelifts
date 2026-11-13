'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  coachAddExercise,
  coachAddWorkout,
  coachDeleteWorkout,
  coachCreateProgram,
  coachDeleteExercise,
  coachPushProgram,
  coachSaveExercise,
  coachSaveProgram,
  coachSaveWorkout,
  coachCustomizeWeek,
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

export default function ProgramStudio({ programs, members, counts }) {
  const [programId, setProgramId] = useState(programs[0]?.id || '');
  const [workoutId, setWorkoutId] = useState(programs[0]?.workouts[0]?.id || '');
  const [showNewProgram, setShowNewProgram] = useState(false);
  const [showSend, setShowSend] = useState(false);
  const [addOnDay, setAddOnDay] = useState(null);
  const [weekIndex, setWeekIndex] = useState(0);

  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem('coach-program') || '{}');
      if (saved.p && programs.some((p) => p.id === saved.p)) {
        setProgramId(saved.p);
        const next = programs.find((p) => p.id === saved.p);
        if (Number.isFinite(saved.week)) setWeekIndex(saved.week);
        if (saved.w && next?.workouts.some((w) => w.id === saved.w)) setWorkoutId(saved.w);
      }
    } catch {
      /* ignore */
    }
  }, [programs]);

  useEffect(() => {
    sessionStorage.setItem('coach-program', JSON.stringify({ p: programId, w: workoutId, week: weekIndex }));
  }, [programId, workoutId, weekIndex]);

  const program = useMemo(
    () => programs.find((p) => p.id === programId) || programs[0],
    [programs, programId]
  );
  const weeksDefault =
    program?.planKey === 'wedding' ? 12 : program?.planKey === 'challenge' ? 6 : 4;
  const masterWorkouts = useMemo(
    () => (program?.workouts || []).filter((w) => !w.userId),
    [program]
  );
  const customWeeks = useMemo(() => {
    const set = new Set(masterWorkouts.map((w) => w.weekIndex || 0));
    return set;
  }, [masterWorkouts]);
  const weekWorkouts = useMemo(() => {
    const custom = masterWorkouts.filter((w) => (w.weekIndex || 0) === weekIndex);
    if (custom.length) return custom;
    return masterWorkouts.filter((w) => (w.weekIndex || 0) === 0);
  }, [masterWorkouts, weekIndex]);
  const weekIsCustom = weekIndex === 0 || weekWorkouts.some((w) => (w.weekIndex || 0) === weekIndex);
  const workout = useMemo(
    () => weekWorkouts.find((w) => w.id === workoutId) || weekWorkouts[0],
    [weekWorkouts, workoutId]
  );

  function pickProgram(id) {
    const next = programs.find((p) => p.id === id);
    setProgramId(id);
    const master = (next?.workouts || []).filter((w) => !w.userId);
    const first = master.find((w) => (w.weekIndex || 0) === 0);
    setWorkoutId(first?.id || master[0]?.id || '');
    setWeekIndex(0);
    setShowSend(false);
    setAddOnDay(null);
  }

  function pickWeek(nextWeek) {
    const index = Number(nextWeek);
    setWeekIndex(index);
    setAddOnDay(null);
    const all = (program?.workouts || []).filter((w) => !w.userId);
    const custom = all.filter((w) => (w.weekIndex || 0) === index);
    const list = custom.length ? custom : all.filter((w) => (w.weekIndex || 0) === 0);
    setWorkoutId(list[0]?.id || '');
  }

  function pickDay(dayIndex) {
    const existing = weekWorkouts.find((w) => w.dayOffset === dayIndex);
    if (existing) {
      setWorkoutId(existing.id);
      setAddOnDay(null);
      return;
    }
    if (!weekIsCustom) return;
    setAddOnDay(dayIndex);
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2">
        {programs.map((p) => {
          const active = p.id === program?.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => pickProgram(p.id)}
              className={`rounded-full px-4 py-2 text-[14px] font-medium ${
                active ? 'bg-[#1d1d1f] text-white' : 'bg-white text-[#1d1d1f]'
              }`}
            >
              {p.name}
              <span className={`ml-2 text-[12px] ${active ? 'text-white/60' : 'text-[#6e6e73]'}`}>
                {counts[p.id] || 0} clients
              </span>
            </button>
          );
        })}
        <button
          type="button"
          className="btn-secondary"
          onClick={() => setShowNewProgram((v) => !v)}
        >
          {showNewProgram ? 'Cancel' : '+ Plan'}
        </button>
      </div>

      {showNewProgram ? (
        <form action={coachCreateProgram} className="card space-y-3">
          <Field label="Plan name">
            <input name="name" required placeholder="e.g. Summer strength" className="field" />
          </Field>
          <Field label="Note">
            <input name="description" placeholder="Optional" className="field" />
          </Field>
          <input type="hidden" name="planKey" value="custom" />
          <button className="btn-primary">Create plan</button>
        </form>
      ) : null}

      {program ? (
        <>
          <section>
            <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-[13px] font-semibold uppercase tracking-wide text-[#6e6e73]">
                  Week template
                </p>
                <p className="mt-1 text-[14px] text-[#6e6e73]">
                  Each client starts their own week 1 on the day they join. Empty days are rest.
                </p>
              </div>
              <label className="text-[13px] font-medium text-[#1d1d1f]">
                Week
                <select
                  className="field mt-1 min-w-[10rem]"
                  value={weekIndex}
                  onChange={(e) => pickWeek(e.target.value)}
                >
                  {Array.from({ length: weeksDefault }, (_, i) => (
                    <option key={i} value={i}>
                      Week {i + 1}
                      {i === 0 ? '' : customWeeks.has(i) ? ' · custom' : ' · same as week 1'}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            {!weekIsCustom ? (
              <form action={coachCustomizeWeek} className="mb-3 flex flex-wrap items-center gap-3 rounded-2xl bg-white px-4 py-3 text-[14px]">
                <input type="hidden" name="programId" value={program.id} />
                <input type="hidden" name="weekIndex" value={weekIndex} />
                <p className="flex-1 text-[#6e6e73]">
                  Week {weekIndex + 1} still copies week 1. Customize it to change loads for clients who reach this week.
                </p>
                <button className="btn-primary px-4">Customize week {weekIndex + 1}</button>
              </form>
            ) : null}
            <div className="grid grid-cols-7 gap-1 md:gap-2">
              {DAYS.map((label, i) => {
                const dayWorkouts = weekWorkouts.filter((w) => w.dayOffset === i);
                const selected = dayWorkouts.some((w) => w.id === workout?.id) && addOnDay == null;
                const adding = addOnDay === i;
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => pickDay(i)}
                    className={`min-h-[88px] rounded-2xl px-1 py-3 text-center md:px-2 ${
                      selected || adding
                        ? 'bg-[#1d1d1f] text-white'
                        : 'bg-white text-[#1d1d1f]'
                    }`}
                  >
                    <p className={`text-[11px] uppercase tracking-wide ${selected || adding ? 'text-white/60' : 'text-[#6e6e73]'}`}>
                      {label}
                    </p>
                    {dayWorkouts.length ? (
                      dayWorkouts.map((w) => (
                        <p key={w.id} className="mt-1 text-[12px] font-medium leading-tight md:text-[13px]">
                          {w.name}
                        </p>
                      ))
                    ) : (
                      <p className={`mt-2 text-[12px] ${selected || adding ? 'text-white/50' : 'text-[#aeaeb2]'}`}>
                        Rest
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          {addOnDay != null && weekIsCustom ? (
            <form action={coachAddWorkout} className="card grid gap-3 md:grid-cols-2">
              <input type="hidden" name="programId" value={program.id} />
              <input type="hidden" name="weekIndex" value={weekIndex} />
              <input type="hidden" name="dayOffset" value={addOnDay} />
              <p className="text-[15px] font-semibold md:col-span-2">
                New session · {DAYS_LONG[addOnDay]}
              </p>
              <Field label="Title clients see">
                <input name="name" required placeholder="e.g. Lower A · Squat" className="field" />
              </Field>
              <Field label="Minutes">
                <input name="durationMin" type="number" defaultValue={40} className="field" />
              </Field>
              <div className="md:col-span-2">
                <Field label="Note (optional)">
                  <input name="notes" placeholder="Warm up 5 minutes" className="field" />
                </Field>
              </div>
              <div className="flex gap-4 md:col-span-2">
                <button className="btn-primary">Add session</button>
                <button type="button" className="btn-secondary" onClick={() => setAddOnDay(null)}>
                  Cancel
                </button>
              </div>
            </form>
          ) : null}

          {workout && addOnDay == null && weekIsCustom ? (
            <section key={workout.id} className="card">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-[12px] font-medium uppercase tracking-wide text-[#6e6e73]">
                    {DAYS_LONG[workout.dayOffset]}
                  </p>
                  <h2 className="mt-1 text-[22px] font-semibold tracking-tight">{workout.name}</h2>
                </div>
                <form
                  action={coachDeleteWorkout}
                  onSubmit={(e) => {
                    if (!window.confirm('Remove this day from the weekly template?')) e.preventDefault();
                  }}
                >
                  <input type="hidden" name="id" value={workout.id} />
                  <button className="btn-danger btn-sm">Remove day</button>
                </form>
              </div>

              <form action={coachSaveWorkout} className="mt-5 grid gap-3 md:grid-cols-3">
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
                  <Field label="Note for that day">
                    <input name="notes" defaultValue={workout.notes} className="field" />
                  </Field>
                </div>
                <button className="btn-secondary justify-self-start">Save day</button>
              </form>

              <h3 className="mt-8 text-[17px] font-semibold">Lifts</h3>
              <p className="mt-1 text-[14px] text-[#6e6e73]">
                Change a lift here. Upcoming sessions on this plan pick it up. Finished workouts stay as logged.
              </p>

              {workout.exercises.length === 0 ? (
                <p className="mt-4 text-[15px] text-[#6e6e73]">No lifts yet.</p>
              ) : (
                <ul className="mt-4 divide-y divide-black/[0.06]">
                  {workout.exercises.map((e) => (
                    <li key={e.id} className="py-4 first:pt-0">
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
              )}

              <form action={coachAddExercise} className="mt-6 border-t border-black/[0.06] pt-5">
                <input type="hidden" name="workoutId" value={workout.id} />
                <p className="text-[15px] font-semibold">Add a lift</p>
                <div className="mt-3 grid gap-3 md:grid-cols-[1fr_5rem_6rem_6rem]">
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
                <button className="btn-primary mt-4">Add lift</button>
              </form>
            </section>
          ) : null}

          <details>
            <summary className="btn-secondary">Rename this plan</summary>
            <form action={coachSaveProgram} className="card mt-3 grid gap-3 md:grid-cols-2">
              <input type="hidden" name="id" value={program.id} />
              <input type="hidden" name="planKey" value={program.planKey.startsWith('custom-') ? 'custom' : program.planKey} />
              <Field label="Plan name">
                <input name="name" defaultValue={program.name} required className="field" />
              </Field>
              <Field label="Note">
                <input name="description" defaultValue={program.description} className="field" />
              </Field>
              <button className="btn-primary justify-self-start">Save name</button>
            </form>
          </details>

          <div className="card space-y-4">
            <div>
              <p className="text-[17px] font-semibold">Send this plan</p>
              <p className="mt-1 text-[14px] text-[#6e6e73]">
                Places the master weeks on each ticked calendar from that client’s own start date. Logged days stay. A week you customized for one client stays theirs.
              </p>
            </div>
            {!showSend ? (
              <button type="button" className="btn-primary" onClick={() => setShowSend(true)}>
                Send to clients
              </button>
            ) : (
              <form key={program.id} action={coachPushProgram} className="space-y-3">
                <input type="hidden" name="programId" value={program.id} />
                <ul className="max-h-48 space-y-1 overflow-y-auto">
                  {members.map((m) => {
                    const membership = m.memberships[0];
                    const suggested =
                      membership?.programId === program.id || membership?.plan === program.planKey;
                    return (
                      <li key={m.id}>
                        <label className="flex min-h-[44px] items-center gap-3 text-[14px]">
                          <input
                            type="checkbox"
                            name="userIds"
                            value={m.id}
                            defaultChecked={suggested}
                          />
                          <span>
                            {m.name}
                            <span className="text-[#6e6e73]"> · {membership?.plan ?? 'no plan'}</span>
                          </span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
                <Field label="Weeks to place on the calendar">
                  <input
                    name="weeks"
                    type="number"
                    defaultValue={weeksDefault}
                    min={1}
                    max={16}
                    className="field max-w-[8rem]"
                  />
                </Field>
                <div className="flex flex-wrap gap-2">
                  <button className="btn-primary">Send to ticked names</button>
                  <button type="button" className="btn-secondary" onClick={() => setShowSend(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </>
      ) : (
        <p className="text-[15px] text-[#6e6e73]">Create a plan to start.</p>
      )}
    </div>
  );
}
