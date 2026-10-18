import { NextRequest, NextResponse } from 'next/server';
import { handleGetUserBookings } from '@/lib/api-handlers';

export async function POST() {
  return NextResponse.json({ error: 'Please use the secure website checkout to create a booking.' }, { status: 410 });
}

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const result = await handleGetUserBookings(authHeader);
    return NextResponse.json(result.body, { status: result.status });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
