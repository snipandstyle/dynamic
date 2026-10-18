import { NextRequest, NextResponse } from 'next/server';
import {
  handleGetAdminCoupons,
  handleCreateAdminCoupon,
  handleUpdateAdminCoupon,
  handleDeleteAdminCoupon,
} from '@/lib/api-handlers';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const result = await handleGetAdminCoupons(authHeader);
    return NextResponse.json(result.body, { status: result.status });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const body = await req.json();
    const result = await handleCreateAdminCoupon(body, authHeader);
    return NextResponse.json(result.body, { status: result.status });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const body = await req.json();
    const result = await handleUpdateAdminCoupon(body.id, body, authHeader);
    return NextResponse.json(result.body, { status: result.status });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const body = req.headers.get('content-type')?.includes('application/json')
      ? await req.json().catch(() => ({}))
      : {};
    const couponId = id || body.id;
    const result = await handleDeleteAdminCoupon(couponId, authHeader);
    return NextResponse.json(result.body, { status: result.status });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
