'use client';

import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export async function initMSW() {
  if (process.env.NEXT_PUBLIC_MSW_ENABLED === 'true') {
    console.log('Initializing MSW...');
    const worker = setupWorker(...handlers);
    try {
      await worker.start({
        onUnhandledRequest(request, print) {
          console.log('🚀 Unhandled request:', request.url);
          if (request.url.includes('_next')) {
            return;
          }
          print.warning();
        },
      });
      console.log('MSW Started successfully');
    } catch (error) {
      console.error('MSW Initialization Error:', error);
    }
  } else {
    console.log('MSW is not enabled');
  }
}
