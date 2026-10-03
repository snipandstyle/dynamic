import type { Plugin } from 'vite';
import {
  handleSignup,
  handleLogin,
  handleGetMe,
  handleCreateBooking,
  handleGetUserBookings,
  handleGetAdminBookings,
  handleUpdateAdminBooking,
  handleCreateRazorpayOrderRoute,
  handleVerifyRazorpayPaymentRoute,
  handleGetOffersRoute,
  handleHealthCheckRoute,
} from '../lib/api-handlers';

function readJsonBody(req: any): Promise<any> {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk: any) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({});
      }
    });
  });
}

export function viteApiPlugin(): Plugin {
  return {
    name: 'vite-fullstack-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url || '';
        if (!url.startsWith('/api/')) {
          return next();
        }

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        if (req.method === 'OPTIONS') {
          res.statusCode = 204;
          return res.end();
        }

        try {
          const authHeader = req.headers.authorization;
          const [pathname] = url.split('?');

          let result: { status: number; body: any } = { status: 404, body: { error: 'Endpoint not found' } };

          if (pathname === '/api/health' && req.method === 'GET') {
            result = await handleHealthCheckRoute();
          } else if (pathname === '/api/auth/signup' && req.method === 'POST') {
            const body = await readJsonBody(req);
            result = await handleSignup(body);
          } else if (pathname === '/api/auth/login' && req.method === 'POST') {
            const body = await readJsonBody(req);
            result = await handleLogin(body);
          } else if (pathname === '/api/auth/me' && req.method === 'GET') {
            result = await handleGetMe(authHeader);
          } else if (pathname === '/api/bookings') {
            if (req.method === 'POST') {
              const body = await readJsonBody(req);
              result = await handleCreateBooking(body, authHeader);
            } else if (req.method === 'GET') {
              result = await handleGetUserBookings(authHeader);
            }
          } else if (pathname === '/api/admin/bookings') {
            if (req.method === 'GET') {
              result = await handleGetAdminBookings(authHeader);
            } else if (req.method === 'PATCH') {
              const body = await readJsonBody(req);
              const bookingId = body.bookingId;
              result = await handleUpdateAdminBooking(bookingId, body, authHeader);
            }
          } else if ((pathname === '/api/create-order' || pathname === '/api/razorpay/create-order') && req.method === 'POST') {
            const body = await readJsonBody(req);
            result = await handleCreateRazorpayOrderRoute(body);
          } else if ((pathname === '/api/verify-payment' || pathname === '/api/razorpay/verify-payment') && req.method === 'POST') {
            const body = await readJsonBody(req);
            result = await handleVerifyRazorpayPaymentRoute(body);
          } else if (pathname === '/api/offers' && req.method === 'GET') {
            result = await handleGetOffersRoute();
          }

          res.statusCode = result.status;
          res.end(JSON.stringify(result.body));
        } catch (err: any) {
          console.error('[API Middleware Error]', err);
          res.statusCode = 500;
          res.end(JSON.stringify({ error: err.message || 'Internal Server Error' }));
        }
      });
    },
  };
}
