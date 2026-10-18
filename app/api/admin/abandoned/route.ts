import { NextRequest, NextResponse } from 'next/server';
import {
  handleGetAdminAbandonedCheckouts,
  handleUpdateAdminAbandoned,
  handleDeleteAdminAbandoned,
} from '@/lib/api-handlers';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const result = await handleGetAdminAbandonedCheckouts(authHeader);
    return NextResponse.json(result.body, { status: result.status });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const body = await req.json();
    const result = await handleUpdateAdminAbandoned(body.id, body, authHeader);
    return NextResponse.json(result.body, { status: result.status });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Lead ID is required' }, { status: 400 });
    }
    const result = await handleDeleteAdminAbandoned(id, authHeader);
    return NextResponse.json(result.body, { status: result.status });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}
