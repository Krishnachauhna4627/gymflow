import { Router } from 'express';
import db from '../db.js';
import { clearFailures, recordFailure, retryAfter } from '../lib/login-throttle.js';
import { hashPassword, verifyPassword } from '../lib/password.js';
import { SESSION_COOKIE, createSession, deleteSession, findSession } from '../lib/sessions.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

const findUserForLogin = db.prepare('SELECT id, password_hash FROM users WHERE user_id = ? OR email = ?');

// Compared against when the user doesn't exist, so response time doesn't reveal valid user IDs.
const DUMMY_HASH = await hashPassword('not-a-real-password');

const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  path: '/',
};

/** POST /api/auth/login — { userId (user ID or email), password, remember } */
router.post('/login', async (req, res) => {
  const identifier = typeof req.body?.userId === 'string' ? req.body.userId.trim().toLowerCase() : '';
  const password = typeof req.body?.password === 'string' ? req.body.password : '';
  const remember = req.body?.remember === true;

  if (!identifier || !password) {
    return res.status(400).json({ message: 'Enter your user ID and password.' });
  }

  const wait = retryAfter(req.ip, identifier);
  if (wait) {
    res.set('Retry-After', String(Math.ceil(wait / 1000)));
    return res.status(429).json({
      message: `Too many failed attempts. Please try again in ${Math.ceil(wait / 60000)} minutes.`,
    });
  }

  const user = findUserForLogin.get(identifier, identifier);
  const valid = await verifyPassword(password, user?.password_hash ?? DUMMY_HASH);
  if (!user || !valid) {
    recordFailure(req.ip, identifier);
    return res.status(401).json({ message: 'Incorrect user ID or password.' });
  }

  clearFailures(req.ip, identifier);
  const { token, ttl } = createSession(user.id, remember);
  // Without "remember me" the cookie ends with the browser session (server still expires it).
  res.cookie(SESSION_COOKIE, token, remember ? { ...cookieOptions, maxAge: ttl } : cookieOptions);

  const { user: profile, gym } = findSession(token);
  res.json({ user: profile, gym });
});

/** POST /api/auth/logout */
router.post('/logout', (req, res) => {
  deleteSession(req.session?.token);
  res.clearCookie(SESSION_COOKIE, cookieOptions);
  res.status(204).end();
});

/** GET /api/auth/me — the signed-in user and their gym. */
router.get('/me', requireAuth, (req, res) => {
  res.json({ user: req.session.user, gym: req.session.gym });
});

export default router;
