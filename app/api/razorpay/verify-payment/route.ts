import { NextRequest, NextResponse } from 'next/server';
import { handleVerifyRazorpayPaymentRoute } from '@/lib/api-handlers';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await handleVerifyRazorpayPaymentRoute(body);
    return NextResponse.json(result.body, { status: result.status });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
