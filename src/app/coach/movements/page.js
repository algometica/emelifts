import { redirect } from 'next/navigation';
import { getSessionUser, isCoach } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { coachAddMovement, coachSaveMovement } from '@/app/actions';
import { youtubeId } from '@/lib/youtube';

export const metadata = { title: 'Movements | Emelifts' };

export default async function MovementsPage() {
  const user = await getSessionUser();
  if (!isCoach(user)) redirect('/login');

  const movements = await prisma.movement.findMany({
    include: { _count: { select: { exercises: true } } },
    orderBy: { name: 'asc' },
  });

  return (
    <div className="mx-auto min-h-[100dvh] max-w-3xl px-5 py-10">
      <a href="/coach" className="btn-secondary btn-sm">
        Back to Clients
      </a>
      <h1 className="mt-4 text-[32px] font-semibold tracking-tight">Movement library</h1>
      <p className="mt-2 text-[15px] text-[#6e6e73]">
        Paste a YouTube link when you have it. Members see that demo on the movement in
        their workout. Empty slots stay ready and do not clutter the calendar.
      </p>

      <form action={coachAddMovement} className="mt-8 grid gap-3 rounded-[22px] bg-[#f5f5f7] p-5 md:grid-cols-[1fr_1fr_auto]">
        <input name="name" required placeholder="Movement name" className="h-11 rounded-xl border px-3" />
        <input name="youtubeUrl" placeholder="YouTube URL (optional)" className="h-11 rounded-xl border px-3" />
        <button type="submit" className="btn-primary">
          Add
        </button>
      </form>

      <ul className="mt-8 space-y-4">
        {movements.map((m) => (
          <li key={m.id} className="rounded-[22px] border border-black/[0.08] p-5">
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="text-[18px] font-semibold">{m.name}</h2>
              <span className="text-[13px] text-[#6e6e73]">
                {m._count.exercises} workout use{m._count.exercises === 1 ? '' : 's'}
              </span>
            </div>
            <form action={coachSaveMovement} className="mt-3 grid gap-3 md:grid-cols-[1fr_auto]">
              <input type="hidden" name="id" value={m.id} />
              <input
                name="youtubeUrl"
                defaultValue={m.youtubeUrl}
                placeholder="https://youtu.be/..."
                className="h-11 rounded-xl border px-3"
              />
              <button type="submit" className="btn-secondary">
                Save link
              </button>
            </form>
            <p className="mt-2 text-[13px] text-[#6e6e73]">
              {youtubeId(m.youtubeUrl) ? 'Demo ready for members.' : 'No video yet. Slot is ready.'}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
