const request = require('supertest');
const app = require('../../src/app');
const logger = require('../../src/logger');
var fragmentData;

beforeAll(async () => {
  const createRes = await request(app)
    .post('/v1/fragments')
    .auth('user1@email.com', 'password1')
    .set({ 'Content-Type': 'text/plain' })
    .send('{"this": "is a test"}');

  logger.debug({ createRes }, 'create res');
  fragmentData = JSON.parse(createRes.text).fragment.id;
  logger.debug({ fragmentData }, 'THIS IS FRAGMENT DATA');
});

describe('Delete /v1/fragments', () => {
  test('Unauthenticated users receives 401 when trying to delete', async () => {
    const res = await request(app).delete(`/v1/fragments/${fragmentData}`);
    expect(res.statusCode).toBe(401);
  });

  test('Authenticated users can successfully delete', async () => {
    const res = await request(app)
      .delete(`/v1/fragments/${fragmentData}`)
      .auth('user1@email.com', 'password1');

    expect(res.statusCode).toBe(200);
  });

  test('Receive 400 when trying to delete something already deleted', async () => {
    const res = await request(app)
      .delete(`/v1/fragments/${fragmentData}`)
      .auth('user1@email.com', 'password1');

    expect(res.statusCode).toBe(400);
  });
});
