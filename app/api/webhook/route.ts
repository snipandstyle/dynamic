import { NextRequest, NextResponse } from 'next/server';
import { handleRazorpayWebhookRoute } from '@/lib/api-handlers';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature');
    let jsonBody = {};
    try {
      jsonBody = rawBody ? JSON.parse(rawBody) : {};
    } catch {
      jsonBody = {};
    }

    const result = await handleRazorpayWebhookRoute(jsonBody, rawBody, signature);
    return NextResponse.json(result.body, { status: result.status });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
