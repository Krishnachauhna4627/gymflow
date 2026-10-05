import { parseCookies } from '../lib/cookies.js';
import { SESSION_COOKIE, findSession } from '../lib/sessions.js';

/** Attaches `req.session` ({ token, user, gym }) when a valid session cookie is present. */
export function loadSession(req, res, next) {
  const token = parseCookies(req.headers.cookie)[SESSION_COOKIE];
  const session = findSession(token);
  req.session = session ? { token, ...session } : null;
  next();
}

export function requireAuth(req, res, next) {
  if (!req.session) {
    return res.status(401).json({ message: 'Please log in to continue.' });
  }
  next();
}
