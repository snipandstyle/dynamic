import { NextRequest, NextResponse } from 'next/server';
import { handleGetAdminBookings, handleUpdateAdminBooking } from '@/lib/api-handlers';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const result = await handleGetAdminBookings(authHeader);
    return NextResponse.json(result.body, { status: result.status });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const body = await req.json();
    const result = await handleUpdateAdminBooking(body.bookingId, body, authHeader);
    return NextResponse.json(result.body, { status: result.status });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
