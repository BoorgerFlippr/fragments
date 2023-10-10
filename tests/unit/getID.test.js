const request = require('supertest');
const app = require('../../src/app');
const logger = require('../../src/logger');
var fragmentData;
beforeAll(async () => {
  const createRes = await request(app)
    .post('/v1/fragments')
    .auth('user1@email.com', 'password1')
    .set({ 'Content-Type': 'text/plain' })
    .send('This is a test');

  // /v1/fragments returns a buffer
  logger.debug({ createRes }, 'create res');
  fragmentData = JSON.parse(createRes.text).fragment.id;
  logger.debug({ fragmentData }, 'THIS IS FRAGMENT DATA');
});

describe('GET /fragments/:ID', () => {
  test('Unauthenticated requests receive a 401 status', async () => {
    const res = await request(app).get(`/v1/fragments/${fragmentData}`);
    expect(res.statusCode).toBe(401);
  });

  test('Authenticated users get a fragment returned to them', async () => {
    // Authenticate the request
    const res = await request(app)
      .get(`/v1/fragments/${fragmentData}`)
      .auth('user1@email.com', 'password1');

    expect(res.statusCode).toBe(200);
    logger.debug({ res }, 'TEST RESPONSE');
  });
});
