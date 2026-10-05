import { after, before, describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { mkdtempSync, readdirSync, rmSync } from 'node:fs';
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
});

after(() => {
  server.close();
  rmSync(uploadDir, { recursive: true, force: true });
});

const validGym = {
  gymName: 'Iron Gym',
  ownerName: 'Ravi Kumar',
  mobile: '+91 98765 43210',
  email: 'Ravi@Example.com',
  userId: 'ravi.k',
  password: 'secret123',
};

const register = (body) =>
  fetch(`${baseUrl}/api/gyms`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

describe('POST /api/gyms', () => {
  it('creates a gym with its owner and never returns the password', async () => {
    const res = await register(validGym);
    const body = await res.json();

    assert.equal(res.status, 201);
    assert.equal(body.gym.name, 'Iron Gym');
    assert.equal(body.gym.logoUrl, null);
    assert.deepEqual(body.owner, { id: 1, name: 'Ravi Kumar', email: 'ravi@example.com', userId: 'ravi.k' });
    assert.ok(!JSON.stringify(body).includes('secret123'));
  });

  it('rejects a duplicate email and user ID with 409', async () => {
    const res = await register({ ...validGym, email: 'ravi@example.com', userId: 'RAVI.K' });
    const body = await res.json();

    assert.equal(res.status, 409);
    assert.ok(body.errors.email);
    assert.ok(body.errors.userId);
  });

  it('returns field errors for invalid input', async () => {
    const res = await register({ gymName: 'A', mobile: '12345', email: 'nope', userId: 'a b', password: 'short' });
    const body = await res.json();

    assert.equal(res.status, 400);
    assert.deepEqual(Object.keys(body.errors).sort(), ['email', 'gymName', 'mobile', 'ownerName', 'password', 'userId']);
  });

  it('stores the password hashed', async () => {
    const { default: db } = await import('../src/db.js');
    const { password_hash } = db.prepare('SELECT password_hash FROM users WHERE user_id = ?').get('ravi.k');
    const { verifyPassword } = await import('../src/lib/password.js');

    assert.notEqual(password_hash, 'secret123');
    assert.equal(await verifyPassword('secret123', password_hash), true);
  });
});

const PNG_1X1 = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  'base64',
);

const registerWithLogo = (fields, logo, type = 'image/png') => {
  const form = new FormData();
  for (const [key, value] of Object.entries(fields)) form.append(key, value);
  if (logo) form.append('logo', new Blob([logo], { type }), 'logo.png');
  return fetch(`${baseUrl}/api/gyms`, { method: 'POST', body: form });
};

describe('gym logo', () => {
  const gym = (n) => ({ ...validGym, email: `owner${n}@example.com`, userId: `owner${n}` });

  it('accepts a PNG logo and serves it back', async () => {
    const res = await registerWithLogo(gym(1), PNG_1X1);
    const body = await res.json();

    assert.equal(res.status, 201);
    assert.equal(body.gym.logoUrl, `/api/gyms/${body.gym.id}/logo`);

    const logo = await fetch(baseUrl + body.gym.logoUrl);
    assert.equal(logo.status, 200);
    assert.equal(logo.headers.get('content-type'), 'image/png');
    assert.deepEqual(Buffer.from(await logo.arrayBuffer()), PNG_1X1);
  });

  it('rejects a file that is not really an image, whatever its declared type', async () => {
    const files = readdirSync(join(uploadDir, 'logos')).length;
    const res = await registerWithLogo(gym(2), Buffer.from('<svg onload="alert(1)"/>'), 'image/png');
    const body = await res.json();

    assert.equal(res.status, 400);
    assert.match(body.errors.logo, /PNG, JPG or WebP/);
    assert.equal(readdirSync(join(uploadDir, 'logos')).length, files);
  });

  it('rejects logos over 2 MB', async () => {
    const big = Buffer.concat([PNG_1X1, Buffer.alloc(2 * 1024 * 1024)]);
    const res = await registerWithLogo(gym(3), big);
    const body = await res.json();

    assert.equal(res.status, 400);
    assert.equal(body.errors.logo, 'Logo must be 2 MB or smaller.');
  });

  it('does not keep the logo file when registration fails', async () => {
    const files = readdirSync(join(uploadDir, 'logos')).length;
    const res = await registerWithLogo(gym(1), PNG_1X1);

    assert.equal(res.status, 409);
    assert.equal(readdirSync(join(uploadDir, 'logos')).length, files);
  });

  it('returns 404 for a gym without a logo', async () => {
    const res = await fetch(`${baseUrl}/api/gyms/1/logo`);
    assert.equal(res.status, 404);
  });
});
