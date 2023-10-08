const request = require('supertest');

const app = require('../../src/app');

describe('POST /v1/fragments', () => {
  test('unauthenticated users are denied', () => request(app).post('/v1/fragments').expect(401));

  test('authenticated users can create a fragment', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is a test');

    expect(res.statusCode).toBe(201);
  });

  test('entering a bad type returns 415', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'application/msword')
      .send('This is a test');

    expect(res.statusCode).toBe(415);
  });
});
