import { redirect } from 'next/navigation';
import AppShell from '@/components/app/AppShell';
import MessageForm from '@/components/app/MessageForm';
import MessageList from '@/components/app/MessageList';
import { getSessionUser, hasAppAccess } from '@/lib/session';
import { prisma } from '@/lib/prisma';

export const metadata = { title: 'Messages | Emelifts' };
export const dynamic = 'force-dynamic';

function formatWhen(date) {
  const d = new Date(date);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const h = d.getHours();
  const m = String(d.getMinutes()).padStart(2, '0');
  const hour12 = h % 12 || 12;
  const ampm = h >= 12 ? 'p.m.' : 'a.m.';
  return `${months[d.getMonth()]} ${d.getDate()}, ${hour12}:${m} ${ampm}`;
}

export default async function MessagesPage() {
  const user = await getSessionUser();
  if (!user) redirect('/login');
  if (!hasAppAccess(user)) redirect('/app/waiting');

  const coach = await prisma.user.findFirst({ where: { role: 'coach' } });
  const rows = coach
    ? await prisma.message.findMany({
        where: {
          OR: [
            { fromUserId: user.id, toUserId: coach.id },
            { fromUserId: coach.id, toUserId: user.id },
          ],
        },
        orderBy: { createdAt: 'asc' },
      })
    : [];

  await prisma.message.updateMany({
    where: { toUserId: user.id, readAt: null },
    data: { readAt: new Date() },
  });

  const messages = rows.map((m) => ({
    id: m.id,
    fromUserId: m.fromUserId,
    body: m.body,
    when: formatWhen(m.createdAt),
    createdAt: m.createdAt.toISOString(),
    edited: Boolean(m.editedAt),
  }));

  return (
    <AppShell title="Em" subtitle="Coach">
      <MessageList messages={messages} currentUserId={user.id} />
      <div className="mt-6">
        <MessageForm toUserId={coach?.id} />
      </div>
    </AppShell>
  );
}
