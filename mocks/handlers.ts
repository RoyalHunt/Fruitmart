import {
  PathParams,
  DefaultBodyType,
  HttpResponseResolver,
  delay,
  http,
  HttpResponse,
  passthrough,
} from 'msw';

function randomDelay(min: number = 100, max: number = 5000): number {
  const minDivisible = Math.ceil(min / 100);
  const maxDivisible = Math.floor(max / 100);
  const randomDivisible =
    Math.floor(Math.random() * (maxDivisible - minDivisible + 1)) + minDivisible;
  return randomDivisible * 100;
}

function withDelay<
  Params extends PathParams,
  RequestBodyType extends DefaultBodyType,
  ResponseBodyType extends DefaultBodyType,
>(
  durationMs: number,
  resolver: HttpResponseResolver<Params, RequestBodyType, ResponseBodyType>,
): HttpResponseResolver<Params, RequestBodyType, ResponseBodyType> {
  return async (...args) => {
    await delay(durationMs);
    return resolver(...args);
  };
}

export type Product = {
  id: string;
  name: string;
  price: number;
  stockLevel: number;
};

export const handlers = [
  http.get<never, never, Product[]>(
    '/products',
    withDelay(randomDelay(), () => {
      return HttpResponse.json([
        { id: 'apple', name: 'Apples', price: 2, stockLevel: 6 },
        { id: 'orange', name: 'Oranges', price: 1.5, stockLevel: 1 },
        { id: 'mango', name: 'Mangos', price: 5, stockLevel: 0 },
      ]);
    }),
  ),
  http.get('/events', () => {
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      start(controller) {
        const sendEvent = (data: string, event?: string) => {
          const formattedEvent = event ? `event: ${event}\ndata: ${data}\n\n` : `data: ${data}\n\n`;
          controller.enqueue(encoder.encode(formattedEvent));
        };

        sendEvent('Connected to SSE', 'connect');

        const intervalId = setInterval(() => {
          sendEvent(
            JSON.stringify({
              timestamp: new Date().toISOString(),
              message: { shouldUpdate: Math.random() >= 0.5 },
            }),
            'update',
          );
        }, 20000);

        return () => {
          clearInterval(intervalId);
          controller.close();
        };
      },
    });

    return new HttpResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        Connection: 'keep-alive',
      },
    });
  }),
  http.all('*', () => {
    return passthrough();
  }),
];
