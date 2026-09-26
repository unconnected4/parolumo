import '@testing-library/jest-dom/vitest';
import { beforeAll, afterEach, afterAll } from 'vitest';
import { setupServer } from 'msw/node';
import { handlers, resetMockStore } from '../mocks/handlers';

export const server = setupServer(...handlers);

// Every request the app makes must have a handler: a typo in a URL fails the test instead of hanging.
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => {
  server.resetHandlers();
  resetMockStore();
});
afterAll(() => server.close());
