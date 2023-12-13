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

describe('GET /fragments/:ID', () => {
  test('Unauthenticated requests receive a 401 status', async () => {
    const res = await request(app).get(`/v1/fragments/${fragmentData}`);
    expect(res.statusCode).toBe(401);
  });

  test('Authenticated users get a fragment returned to them', async () => {
    const res = await request(app)
      .get(`/v1/fragments/${fragmentData}`)
      .auth('user1@email.com', 'password1');

    expect(res.statusCode).toBe(200);
    logger.debug({ res }, 'TEST RESPONSE');
  });

  test('Bad request returns a 404', async () => {
    const res = await request(app)
      .get(`/v1/fragments${fragmentData}`)
      .auth('user1@email.com', 'password1');

    expect(res.statusCode).toBe(404);
    logger.debug({ res }, 'TEST RESPONSE');
  });

  test('Fragments get converted into html', async () => {
    const res = await request(app)
      .get(`/v1/fragments/${fragmentData}.html`)
      .auth('user1@email.com', 'password1');

    expect(res.statusCode).toBe(200);
    logger.debug({ res }, 'TEST RESPONSE');
  });

  test('Text fragment can not convert to image', async () => {
    const res = await request(app)
      .get(`/v1/fragments/${fragmentData}.png`)
      .auth('user1@email.com', 'password1');

    expect(res.statusCode).toBe(415);
    logger.debug({ res }, 'TEST RESPONSE(img)');
  });

  test('Text fragment can do a valid conversion', async () => {
    const res = await request(app)
      .get(`/v1/fragments/${fragmentData}.json`)
      .auth('user1@email.com', 'password1');

    expect(res.statusCode).toBe(200);
    logger.debug({ res }, 'TEST RESPONSE');
  });
});
