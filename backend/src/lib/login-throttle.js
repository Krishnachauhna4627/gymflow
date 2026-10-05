/**
 * In-memory brute-force guard: after MAX_FAILURES failed logins for the same
 * IP + identifier within WINDOW_MS, further attempts are refused until the window ends.
 * (Per-process only — move to a shared store if the API ever runs on several instances.)
 */
const MAX_FAILURES = 10;
const WINDOW_MS = 15 * 60 * 1000;
const failures = new Map();

const keyFor = (ip, identifier) => `${ip}|${identifier}`;

/** Milliseconds until this key may try again, or 0 if allowed now. */
export function retryAfter(ip, identifier) {
  const entry = failures.get(keyFor(ip, identifier));
  if (!entry) return 0;
  if (entry.resetAt <= Date.now()) {
    failures.delete(keyFor(ip, identifier));
    return 0;
  }
  return entry.count >= MAX_FAILURES ? entry.resetAt - Date.now() : 0;
}

export function recordFailure(ip, identifier) {
  const key = keyFor(ip, identifier);
  const entry = failures.get(key);
  if (!entry || entry.resetAt <= Date.now()) {
    failures.set(key, { count: 1, resetAt: Date.now() + WINDOW_MS });
  } else {
    entry.count += 1;
  }
}

export function clearFailures(ip, identifier) {
  failures.delete(keyFor(ip, identifier));
}
