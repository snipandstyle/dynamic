import { NextRequest, NextResponse } from 'next/server';
import { handleGetMe } from '@/lib/api-handlers';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const result = await handleGetMe(authHeader);
    return NextResponse.json(result.body, { status: result.status });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
