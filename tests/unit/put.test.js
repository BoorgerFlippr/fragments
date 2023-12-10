const request = require('supertest');
const app = require('../../src/app');
//const logger = require('../../src/logger');
var fID;

beforeAll(async () => {
  const createRes = await request(app)
    .post('/v1/fragments')
    .auth('user1@email.com', 'password1')
    .set({ 'Content-Type': 'text/plain' })
    .send('{"this": "is a test"}');

  fID = JSON.parse(createRes.text).fragment.id;
});

describe(`PUT /v1/fragments/:id`, () => {
  test('Unauthenticated request returns 401', () =>
    request(app).put(`/v1/fragments/${fID}`).expect(401));

  test('A different content type would be rejected', async () => {
    const res = await request(app)
      .put(`/v1/fragments/${fID}`)
      .auth('user1@email.com', 'password1')
      .set({ 'Content-Type': 'text/html' })
      .send('Hello from put');
    expect(res.statusCode).toBe(400);
  });

  test('Fragment not found', async () => {
    const res = await request(app)
      .put(`/v1/fragments/${fID}`)
      .auth('user1@email.com', 'password1')
      .set({ 'Content-Type': 'text/html' })
      .send('Hello from put');
    expect(res.statusCode).toBe(400);
  });

  test('User can edit their fragment', async () => {
    const res = await request(app)
      .put(`/v1/fragments/${fID}`)
      .auth('user1@email.com', 'password1')
      .set({ 'Content-Type': 'text/plain' })
      .send('Hello from put');
    expect(res.statusCode).toBe(201);
  });
});
