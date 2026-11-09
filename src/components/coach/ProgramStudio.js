'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  coachAddExercise,
  coachAddWorkout,
  coachCreateProgram,
  coachDeleteExercise,
  coachPushProgram,
  coachSaveExercise,
  coachSaveProgram,
  coachSaveWorkout,
} from '@/app/actions';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const PLAN_LABEL = {
  monthly: 'Monthly members',
  challenge: '6 week challenge',
  wedding: 'Wedding prep',
};

function planLabel(planKey) {
  if (PLAN_LABEL[planKey]) return PLAN_LABEL[planKey];
  return 'Custom (not from checkout)';
}

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
  const [showNewDay, setShowNewDay] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem('coach-program') || '{}');
      if (saved.p && programs.some((p) => p.id === saved.p)) {
        setProgramId(saved.p);
        const next = programs.find((p) => p.id === saved.p);
        if (saved.w && next?.workouts.some((w) => w.id === saved.w)) setWorkoutId(saved.w);
      }
    } catch {
      /* ignore */
    }
  }, [programs]);

  useEffect(() => {
    sessionStorage.setItem('coach-program', JSON.stringify({ p: programId, w: workoutId }));
  }, [programId, workoutId]);

  const program = useMemo(
    () => programs.find((p) => p.id === programId) || programs[0],
    [programs, programId]
  );
  const workout = useMemo(
    () => program?.workouts.find((w) => w.id === workoutId) || program?.workouts[0],
    [program, workoutId]
  );

  function pickProgram(id) {
    const next = programs.find((p) => p.id === id);
    setProgramId(id);
    setWorkoutId(next?.workouts[0]?.id || '');
    setShowSend(false);
    setShowNewDay(false);
  }

  return (
    <div className="space-y-6">
      <ol className="card grid gap-3 text-[14px] leading-relaxed text-[#6e6e73] md:grid-cols-3">
        <li>
          <span className="font-semibold text-[#1d1d1f]">1. Pick a plan</span>
          <p>Monthly, challenge, or wedding. One plan, many clients.</p>
        </li>
        <li>
          <span className="font-semibold text-[#1d1d1f]">2. Pick a training day</span>
          <p>Example: Monday Lower A. That is one workout.</p>
        </li>
        <li>
          <span className="font-semibold text-[#1d1d1f]">3. Add the lifts</span>
          <p>Name, how many sets, how many reps, rest. Save. Clients see it.</p>
        </li>
      </ol>

      <div>
        <p className="mb-2 text-[13px] font-semibold uppercase tracking-wide text-[#6e6e73]">
          Which plan are you editing?
        </p>
        <div className="grid gap-2 md:grid-cols-3">
          {programs.map((p) => {
            const active = p.id === program?.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => pickProgram(p.id)}
                className={`rounded-2xl border px-4 py-4 text-left ${
                  active
                    ? 'border-[#1d1d1f] bg-[#1d1d1f] text-white'
                    : 'border-black/[0.08] bg-white text-[#1d1d1f]'
                }`}
              >
                <p className="font-semibold">{p.name}</p>
                <p className={`mt-1 text-[13px] ${active ? 'text-white/70' : 'text-[#6e6e73]'}`}>
                  {planLabel(p.planKey)} · {p.workouts.length} training days · {counts[p.id] || 0}{' '}
                  clients
                </p>
              </button>
            );
          })}
        </div>
        <button
          type="button"
          className="btn-secondary mt-2 px-0"
          onClick={() => setShowNewProgram((v) => !v)}
        >
          {showNewProgram ? 'Hide' : 'Add a new plan'}
        </button>
        {showNewProgram ? (
          <form action={coachCreateProgram} className="card mt-3 space-y-3 bg-[#f5f5f7]">
            <Field label="Plan name">
              <input name="name" required placeholder="e.g. Summer strength" className="field" />
            </Field>
            <Field label="Who is this for?">
              <input name="description" placeholder="Short note" className="field" />
            </Field>
            <Field label="Tied to checkout?">
              <select name="planKey" className="field">
                <option value="monthly">Yes, monthly checkout</option>
                <option value="challenge">Yes, 6 week challenge</option>
                <option value="wedding">Yes, wedding prep</option>
                <option value="custom">No, extra plan only I assign</option>
              </select>
            </Field>
            <button className="btn-primary">Create plan</button>
          </form>
        ) : null}
      </div>

      {program ? (
        <>
          <form action={coachSaveProgram} className="grid gap-3 md:grid-cols-2">
            <input type="hidden" name="id" value={program.id} />
            <Field label="Plan name">
              <input name="name" defaultValue={program.name} required className="field" />
            </Field>
            <Field label="Tied to checkout?">
              <select
                name="planKey"
                defaultValue={program.planKey.startsWith('custom-') ? 'custom' : program.planKey}
                className="field"
              >
                <option value="monthly">Monthly checkout</option>
                <option value="challenge">6 week challenge</option>
                <option value="wedding">Wedding prep</option>
                <option value="custom">Custom</option>
              </select>
            </Field>
            <div className="md:col-span-2">
              <Field label="Note (optional)">
                <input name="description" defaultValue={program.description} className="field" />
              </Field>
            </div>
            <button className="btn-secondary justify-self-start px-0">Save plan name</button>
          </form>

          <div>
            <div className="mb-2 flex flex-wrap items-end justify-between gap-2">
              <p className="text-[13px] font-semibold uppercase tracking-wide text-[#6e6e73]">
                Training days this week
              </p>
              <button type="button" className="btn-secondary px-0" onClick={() => setShowNewDay((v) => !v)}>
                {showNewDay ? 'Cancel' : '+ Add a training day'}
              </button>
            </div>
            {program.workouts.length === 0 ? (
              <p className="text-[15px] text-[#6e6e73]">
                No days yet. Add Monday Lower, Tuesday Upper, and so on.
              </p>
            ) : (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {program.workouts.map((w) => {
                  const active = w.id === workout?.id;
                  return (
                    <button
                      key={w.id}
                      type="button"
                      onClick={() => setWorkoutId(w.id)}
                      className={`min-w-[9.5rem] shrink-0 rounded-2xl px-3 py-3 text-left ${
                        active ? 'bg-[#1d1d1f] text-white' : 'bg-white'
                      }`}
                    >
                      <p className={`text-[12px] ${active ? 'text-white/60' : 'text-[#6e6e73]'}`}>
                        {DAYS[w.dayOffset] || 'Day'}
                      </p>
                      <p className="text-[14px] font-medium">{w.name}</p>
                      <p className={`text-[12px] ${active ? 'text-white/60' : 'text-[#6e6e73]'}`}>
                        {w.exercises.length} lifts
                      </p>
                    </button>
                  );
                })}
              </div>
            )}
            {showNewDay ? (
              <form action={coachAddWorkout} className="card mt-3 grid gap-3 bg-[#f5f5f7] md:grid-cols-2">
                <input type="hidden" name="programId" value={program.id} />
                <Field label="What should clients see?">
                  <input name="name" required placeholder="e.g. Lower A · Squat" className="field" />
                </Field>
                <Field label="Which day of the week?">
                  <select name="dayOffset" defaultValue={1} className="field">
                    {DAYS.map((day, i) => (
                      <option key={day} value={i}>
                        {day}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="About how many minutes?">
                  <input name="durationMin" type="number" defaultValue={40} className="field" />
                </Field>
                <Field label="Note for that day (optional)">
                  <input name="notes" placeholder="Warm up 5 minutes" className="field" />
                </Field>
                <button className="btn-primary md:col-span-2">Add this training day</button>
              </form>
            ) : null}
          </div>

          {workout ? (
            <section className="card">
              <p className="text-[13px] font-medium text-[#6e6e73]">
                Editing {DAYS[workout.dayOffset]} · {workout.name}
              </p>
              <form action={coachSaveWorkout} className="mt-3 grid gap-3 md:grid-cols-2">
                <input type="hidden" name="id" value={workout.id} />
                <Field label="Day title">
                  <input name="name" defaultValue={workout.name} required className="field" />
                </Field>
                <Field label="Weekday">
                  <select name="dayOffset" defaultValue={workout.dayOffset} className="field">
                    {DAYS.map((day, i) => (
                      <option key={day} value={i}>
                        {day}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Minutes">
                  <input name="durationMin" type="number" defaultValue={workout.durationMin} className="field" />
                </Field>
                <Field label="Coach note">
                  <input name="notes" defaultValue={workout.notes} className="field" />
                </Field>
                <button className="btn-secondary justify-self-start px-0">Save day settings</button>
              </form>

              <h3 className="mt-8 text-[17px] font-semibold">Lifts on this day</h3>
              <p className="mt-1 text-[14px] text-[#6e6e73]">
                Each row is one movement. Change Goblet squat here and every client on this
                plan sees it.
              </p>

              {workout.exercises.length === 0 ? (
                <p className="mt-4 text-[15px] text-[#6e6e73]">No lifts yet. Add the first one below.</p>
              ) : (
                <ul className="mt-4 space-y-3">
                  {workout.exercises.map((e, index) => (
                    <li key={e.id} className="rounded-2xl bg-[#f5f5f7] p-4">
                      <p className="mb-2 text-[12px] font-medium text-[#6e6e73]">Lift {index + 1}</p>
                      <form action={coachSaveExercise} className="grid gap-3 md:grid-cols-4">
                        <input type="hidden" name="id" value={e.id} />
                        <div className="md:col-span-4">
                          <Field label="Exercise name">
                            <input name="name" defaultValue={e.name} required className="field" />
                          </Field>
                        </div>
                        <Field label="Sets">
                          <input name="sets" type="number" defaultValue={e.sets} className="field" />
                        </Field>
                        <Field label="Reps">
                          <input name="reps" defaultValue={e.reps} className="field" />
                        </Field>
                        <Field label="Rest (seconds)">
                          <input name="restSec" type="number" defaultValue={e.restSec} className="field" />
                        </Field>
                        <div className="flex items-end gap-3">
                          <button className="btn-primary">Save lift</button>
                        </div>
                      </form>
                      <form action={coachDeleteExercise} className="mt-2">
                        <input type="hidden" name="id" value={e.id} />
                        <button className="text-[13px] text-[#9B3B1A]">Remove this lift</button>
                      </form>
                    </li>
                  ))}
                </ul>
              )}

              <form action={coachAddExercise} className="mt-6 rounded-2xl border border-dashed border-black/[0.12] p-4">
                <input type="hidden" name="workoutId" value={workout.id} />
                <p className="text-[15px] font-semibold">Add a lift</p>
                <div className="mt-3 grid gap-3 md:grid-cols-4">
                  <div className="md:col-span-4">
                    <Field label="Exercise name">
                      <input name="name" required placeholder="e.g. Goblet squat" className="field" />
                    </Field>
                  </div>
                  <Field label="Sets">
                    <input name="sets" type="number" defaultValue={3} className="field" />
                  </Field>
                  <Field label="Reps">
                    <input name="reps" defaultValue="8-10" className="field" />
                  </Field>
                  <Field label="Rest (seconds)">
                    <input name="restSec" type="number" defaultValue={90} className="field" />
                  </Field>
                </div>
                <button className="btn-primary mt-4">Add this lift to {DAYS[workout.dayOffset]}</button>
              </form>
            </section>
          ) : null}

          <div className="card">
            <button type="button" className="text-left" onClick={() => setShowSend((v) => !v)}>
              <p className="text-[17px] font-semibold">Put this plan on clients</p>
              <p className="mt-1 text-[14px] text-[#6e6e73]">
                Optional. Paying clients already get their plan at checkout. Use this to
                send or replace a calendar. {showSend ? 'Hide' : 'Show who to send to'}
              </p>
            </button>
            {showSend ? (
              <form action={coachPushProgram} className="mt-4 space-y-3">
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
                <Field label="How many weeks to put on the calendar?">
                  <input
                    name="weeks"
                    type="number"
                    defaultValue={
                      program.planKey === 'wedding' ? 12 : program.planKey === 'challenge' ? 6 : 4
                    }
                    min={1}
                    max={16}
                    className="field max-w-[8rem]"
                  />
                </Field>
                <button className="btn-primary">Send to ticked names</button>
              </form>
            ) : null}
          </div>
        </>
      ) : (
        <p className="text-[15px] text-[#6e6e73]">Create a plan to start.</p>
      )}
    </div>
  );
}
