const request = require('supertest');
const app = require('../../src/app');

describe('/ app', () => {
  test('should return a 404 response', async () => {
    const res = await request(app).get('/unknown');
    expect(res.statusCode).toBe(404);
  });
});
