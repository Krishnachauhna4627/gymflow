import { after, before, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

process.env.DB_PATH = ':memory:';
const uploadDir = mkdtempSync(join(tmpdir(), 'gymflow-test-'));
process.env.UPLOAD_DIR = uploadDir;
const { default: app } = await import('../src/app.js');

let server;
let baseUrl;

before(async () => {
  server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  baseUrl = `http://localhost:${server.address().port}`;

  await post('/api/gyms', {
    gymName: 'Iron Gym',
    ownerName: 'Ravi Kumar',
    mobile: '9876543210',
    email: 'ravi@example.com',
    userId: 'irongym',
    password: 'secret123',
  });
});

after(() => {
  server.close();
  rmSync(uploadDir, { recursive: true, force: true });
});

function post(path, body, cookie) {
  return fetch(baseUrl + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(cookie && { Cookie: cookie }) },
    body: JSON.stringify(body),
  });
}

const sessionCookie = (res) => res.headers.get('set-cookie')?.split(';')[0];
const me = (cookie) => fetch(`${baseUrl}/api/auth/me`, { headers: cookie ? { Cookie: cookie } : {} });

describe('auth', () => {
  it('logs in with user ID, sets an httpOnly session cookie and returns the gym', async () => {
    const res = await post('/api/auth/login', { userId: 'IronGym', password: 'secret123' });
    const body = await res.json();

    assert.equal(res.status, 200);
    assert.match(res.headers.get('set-cookie'), /^gf_session=[\w-]+;.*HttpOnly/i);
    assert.match(res.headers.get('set-cookie'), /SameSite=Lax/i);
    assert.doesNotMatch(res.headers.get('set-cookie'), /Max-Age|Expires/i);
    assert.deepEqual(body.gym, { id: 1, name: 'Iron Gym', logoUrl: null });
    assert.equal(body.user.userId, 'irongym');
    assert.equal(body.user.role, 'owner');
  });

  it('logs in with email too, and "remember me" makes the cookie persistent', async () => {
    const res = await post('/api/auth/login', { userId: 'ravi@example.com', password: 'secret123', remember: true });

    assert.equal(res.status, 200);
    assert.match(res.headers.get('set-cookie'), /Max-Age=2592000/);
  });

  it('rejects a wrong password or unknown user with the same message', async () => {
    const wrong = await post('/api/auth/login', { userId: 'irongym', password: 'nope12345' });
    const unknown = await post('/api/auth/login', { userId: 'ghost', password: 'secret123' });

    assert.equal(wrong.status, 401);
    assert.equal(unknown.status, 401);
    assert.deepEqual(await wrong.json(), await unknown.json());
    assert.equal(wrong.headers.get('set-cookie'), null);
  });

  it('GET /me returns the session user, and 401 without one', async () => {
    const cookie = sessionCookie(await post('/api/auth/login', { userId: 'irongym', password: 'secret123' }));

    assert.equal((await me()).status, 401);
    assert.equal((await me('gf_session=forged')).status, 401);

    const res = await me(cookie);
    assert.equal(res.status, 200);
    assert.equal((await res.json()).gym.name, 'Iron Gym');
  });

  it('logout ends the session on the server', async () => {
    const cookie = sessionCookie(await post('/api/auth/login', { userId: 'irongym', password: 'secret123' }));
    const res = await post('/api/auth/logout', {}, cookie);

    assert.equal(res.status, 204);
    assert.match(res.headers.get('set-cookie'), /gf_session=;/);
    assert.equal((await me(cookie)).status, 401);
  });

  it('locks out an identifier after 10 failed attempts', async () => {
    for (let i = 0; i < 10; i++) {
      await post('/api/auth/login', { userId: 'locked@example.com', password: 'wrong' });
    }
    const res = await post('/api/auth/login', { userId: 'locked@example.com', password: 'wrong' });

    assert.equal(res.status, 429);
    assert.ok(Number(res.headers.get('retry-after')) > 0);
  });
});
