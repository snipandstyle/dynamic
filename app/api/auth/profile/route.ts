import { NextRequest, NextResponse } from 'next/server';
import { handleUpdateProfile } from '@/lib/api-handlers';

export async function PATCH(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const body = await req.json();
    const result = await handleUpdateProfile(body, authHeader);
    return NextResponse.json(result.body, { status: result.status });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
