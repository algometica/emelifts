import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({ error: 'Uploads are off' }, { status: 410 });
}
