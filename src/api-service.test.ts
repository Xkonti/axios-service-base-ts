import { test, expect, beforeEach, afterEach, assert } from 'vitest';
import express from 'express';
import {ApiError} from './api-error.ts';
import {Result} from 'neverthrow';
import {ApiServiceBase} from './api-service-base.ts';

const port = 3167;
const helloMessage = 'Hello there!';

let server: ReturnType<typeof startApiServer>;

function startApiServer() {
  const app = express();

  app.get('/api/hello', (_, res) => {
    res.send(helloMessage);
  });

  return app.listen(port, () => {
    console.log('API server listening on port 3167');
  });
}

beforeEach(() => {
  if (server != null) {
    server.close();
  }
  server = startApiServer();
});

afterEach(() => {
  if (server != null) {
    server.close();
  }
});

class TestService extends ApiServiceBase {
  constructor () {
    super(`http://localhost:${port}/api`);
  }

  public async getHello(): Promise<Result<string, ApiError>> {
    return await this.get('/hello');
  }

  public async getNothing(): Promise<Result<string, ApiError>> {
    return await this.get('/nothing');
  }
}

test('should make a GET request', async () => {
  const service = new TestService();
  const result = await service.getHello();

  assert(result.isOk()); 
  expect(result.value).toBe(helloMessage);
});

test('should fail on non-existent a GET endpoint', async () => {
  const service = new TestService();
  const result = await service.getNothing();

  assert(result.isErr());
  expect(result.error.responseStatus).toBe(404);
});

// TODO: Test POST requests
// TODO: Test PUT requests
// TODO: Test DELETE requests
// TODO: Test PATCH requests
// TODO: Test json body parsing
// TODO: Test sending request data
// TODO: Test sending request headers
// TODO: Test sending request query params
// TODO: Test different response status codes