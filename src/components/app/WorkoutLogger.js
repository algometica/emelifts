'use client';

import { useState, useTransition } from 'react';
import { completeSession, saveSetLog } from '@/app/actions';

export default function WorkoutLogger({ session }) {
  const [pending, start] = useTransition();
  const [seconds, setSeconds] = useState(0);
  const [timerOn, setTimerOn] = useState(false);

  return (
    <div className="space-y-5">
      <p className="text-[15px] text-[#6e6e73]">{session.workout.notes}</p>
      <div className="grid gap-4 md:grid-cols-2">
      {session.workout.exercises.map((exercise) => (
        <section key={exercise.id} className="rounded-2xl border border-black/[0.08] p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-[17px] font-semibold text-[#1d1d1f]">{exercise.name}</h2>
              <p className="text-[13px] text-[#6e6e73]">
                {exercise.sets} × {exercise.reps} · {exercise.restSec}s rest
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSeconds(exercise.restSec);
                setTimerOn(true);
                const started = Date.now();
                const target = exercise.restSec;
                const tick = () => {
                  const left = target - Math.floor((Date.now() - started) / 1000);
                  setSeconds(Math.max(0, left));
                  if (left > 0) requestAnimationFrame(tick);
                  else setTimerOn(false);
                };
                requestAnimationFrame(tick);
              }}
              className="min-h-[36px] rounded-full bg-[#f5f5f7] px-3 text-[12px] font-medium"
            >
              {timerOn && seconds > 0 ? `${seconds}s` : 'Rest'}
            </button>
          </div>
          <div className="mt-3 space-y-2">
            {Array.from({ length: exercise.sets }, (_, i) => {
              const log = exercise.setLogs.find((s) => s.setIndex === i);
              const prev = exercise.previous?.[i];
              return (
                <SetRow
                  key={i}
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
      </div>
      {session.status !== 'completed' ? (
        <form action={completeSession.bind(null, session.id)}>
          <button type="submit" disabled={pending} className="btn-primary w-full">
            Mark workout complete
          </button>
        </form>
      ) : (
        <p className="text-center text-[15px] text-[#6e6e73]">Completed. Nice work.</p>
      )}
    </div>
  );
}

function SetRow({ setIndex, log, prev, onSave }) {
  const [weight, setWeight] = useState(log?.weight ?? '');
  const [reps, setReps] = useState(log?.reps ?? '');
  const [rpe, setRpe] = useState(log?.rpe ?? '');

  return (
    <div className="grid grid-cols-[28px_1fr_1fr_1fr] items-center gap-2">
      <span className="text-[13px] text-[#6e6e73]">{setIndex + 1}</span>
      <input
        inputMode="decimal"
        placeholder={prev?.weight != null ? `last ${prev.weight}` : 'kg'}
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
        onBlur={() => onSave({ weight, reps, rpe })}
        className="h-11 rounded-xl border border-black/[0.1] px-2 text-[15px]"
        aria-label={`Set ${setIndex + 1} weight`}
      />
      <input
        inputMode="numeric"
        placeholder={prev?.reps != null ? `last ${prev.reps}` : 'reps'}
        value={reps}
        onChange={(e) => setReps(e.target.value)}
        onBlur={() => onSave({ weight, reps, rpe })}
        className="h-11 rounded-xl border border-black/[0.1] px-2 text-[15px]"
        aria-label={`Set ${setIndex + 1} reps`}
      />
      <input
        inputMode="decimal"
        placeholder="RPE"
        value={rpe}
        onChange={(e) => setRpe(e.target.value)}
        onBlur={() => onSave({ weight, reps, rpe })}
        className="h-11 rounded-xl border border-black/[0.1] px-2 text-[15px]"
        aria-label={`Set ${setIndex + 1} RPE`}
      />
    </div>
  );
}
