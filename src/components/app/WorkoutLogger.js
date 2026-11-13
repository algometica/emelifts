'use client';

import { useEffect, useState, useTransition } from 'react';
import { finishWorkout, saveSetLog } from '@/app/actions';

export default function WorkoutLogger({ session }) {
  const [pending, start] = useTransition();
  const [restLeft, setRestLeft] = useState(0);
  const [restFor, setRestFor] = useState('');

  useEffect(() => {
    if (restLeft <= 0) return undefined;
    const id = setTimeout(() => setRestLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearTimeout(id);
  }, [restLeft]);

  function startRest(name, seconds) {
    setRestFor(name);
    setRestLeft(seconds);
  }

  return (
    <form action={finishWorkout} className="mx-auto w-full min-w-0 max-w-lg space-y-4">
      <input type="hidden" name="sessionId" value={session.id} />
      {session.workout.notes ? (
        <p className="text-[15px] leading-relaxed text-[#6e6e73]">{session.workout.notes}</p>
      ) : null}

      {session.workout.exercises.map((exercise) => (
        <section key={exercise.id} className="overflow-hidden rounded-2xl bg-[#f5f5f7] p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="text-[17px] font-semibold text-[#1d1d1f]">{exercise.name}</h2>
              <p className="mt-0.5 text-[13px] text-[#6e6e73]">
                {exercise.sets} sets · {exercise.reps} reps · {exercise.restSec}s rest
              </p>
              <LastTime previous={exercise.previous} />
            </div>
            <button
              type="button"
              onClick={() => startRest(exercise.name, exercise.restSec)}
              className="btn-secondary btn-sm shrink-0"
            >
              Rest
            </button>
          </div>

          <div className="mt-3 grid grid-cols-[2.25rem_1fr_1fr] gap-2 px-1 text-[11px] font-medium uppercase tracking-wide text-[#6e6e73]">
            <span>Set</span>
            <span>Weight</span>
            <span>Reps</span>
          </div>
          <div className="mt-1 space-y-2">
            {Array.from({ length: exercise.sets }, (_, i) => {
              const log = exercise.setLogs.find((s) => s.setIndex === i);
              const prev = exercise.previous?.[i];
              return (
                <SetRow
                  key={i}
                  exerciseId={exercise.id}
                  setIndex={i}
                  log={log}
                  prev={prev}
                  onSave={(payload) =>
                    start(() =>
                      saveSetLog({
                        sessionId: session.id,
                        exerciseId: exercise.id,
                        setIndex: i,
                        ...payload,
                      })
                    )
                  }
                />
              );
            })}
          </div>
        </section>
      ))}

      {restLeft > 0 ? (
        <div className="sticky bottom-20 z-20 rounded-2xl bg-[#1d1d1f] px-4 py-3 text-center text-white md:bottom-6">
          <p className="text-[13px] text-white/60">Rest · {restFor}</p>
          <p className="text-[28px] font-semibold tabular-nums">{restLeft}s</p>
          <button type="button" className="btn-primary-dark btn-sm mt-1" onClick={() => setRestLeft(0)}>
            Skip rest
          </button>
        </div>
      ) : null}

      {session.status !== 'completed' ? (
        <button type="submit" disabled={pending} className="btn-primary w-full">
          Finish workout
        </button>
      ) : (
        <p className="text-center text-[15px] text-[#6e6e73]">Logged. Nice work.</p>
      )}
    </form>
  );
}

function LastTime({ previous }) {
  if (!previous?.length) return null;
  const bits = previous
    .filter((p) => p.weight != null || p.reps != null)
    .map((p) => {
      if (p.weight != null && p.reps != null) return `${p.weight} × ${p.reps}`;
      if (p.weight != null) return `${p.weight}`;
      return `${p.reps} reps`;
    });
  if (!bits.length) return null;
  return <p className="mt-1 text-[13px] text-[#0066cc]">Last time: {bits.join(', ')}</p>;
}

function SetRow({ exerciseId, setIndex, log, prev, onSave }) {
  const [weight, setWeight] = useState(log?.weight ?? '');
  const [reps, setReps] = useState(log?.reps ?? '');
  const filled = weight !== '' && reps !== '';

  function save(nextWeight = weight, nextReps = reps) {
    onSave({ weight: nextWeight, reps: nextReps, rpe: log?.rpe ?? '' });
  }

  return (
    <div className="grid grid-cols-[2.25rem_1fr_1fr] items-center gap-2">
      <span
        className={`flex h-11 w-9 items-center justify-center rounded-xl text-[14px] font-medium ${
          filled ? 'bg-[#1d1d1f] text-white' : 'bg-white text-[#6e6e73]'
        }`}
      >
        {setIndex + 1}
      </span>
      <input
        name={`weight:${exerciseId}:${setIndex}`}
        inputMode="decimal"
        placeholder={prev?.weight != null ? String(prev.weight) : '—'}
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
        onBlur={() => save()}
        className="h-11 min-w-0 rounded-xl border-0 bg-white px-3 text-[16px]"
        aria-label={`Set ${setIndex + 1} weight`}
      />
      <input
        name={`reps:${exerciseId}:${setIndex}`}
        inputMode="numeric"
        placeholder={prev?.reps != null ? String(prev.reps) : '—'}
        value={reps}
        onChange={(e) => setReps(e.target.value)}
        onBlur={() => save()}
        className="h-11 min-w-0 rounded-xl border-0 bg-white px-3 text-[16px]"
        aria-label={`Set ${setIndex + 1} reps`}
      />
    </div>
  );
}
