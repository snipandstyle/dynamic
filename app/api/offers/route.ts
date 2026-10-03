import { NextResponse } from 'next/server';
import { handleGetOffersRoute } from '@/lib/api-handlers';

export async function GET() {
  const result = await handleGetOffersRoute();
  return NextResponse.json(result.body, { status: result.status });
}
