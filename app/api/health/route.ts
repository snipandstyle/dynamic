import { NextResponse } from 'next/server';
import { handleHealthCheckRoute } from '@/lib/api-handlers';

export async function GET() {
  const result = await handleHealthCheckRoute();
  return NextResponse.json(result.body, { status: result.status });
}
