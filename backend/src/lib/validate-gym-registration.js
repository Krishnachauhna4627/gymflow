const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOBILE_RE = /^[6-9]\d{9}$/; // Indian mobile number, without +91
const USER_ID_RE = /^[a-z0-9._-]{4,30}$/;

const clean = (value) => (typeof value === 'string' ? value.trim() : '');

/**
 * Normalises and validates the "Create Your Gym" form.
 * Returns `{ data }` when valid, otherwise `{ errors }` keyed by field name.
 */
export function validateGymRegistration(body = {}) {
  const data = {
    gymName: clean(body.gymName),
    ownerName: clean(body.ownerName),
    mobile: clean(body.mobile).replace(/[\s-]/g, '').replace(/^(\+?91)(?=\d{10}$)/, ''),
    email: clean(body.email).toLowerCase(),
    userId: clean(body.userId).toLowerCase(),
    password: typeof body.password === 'string' ? body.password : '',
  };

  const errors = {};

  if (data.gymName.length < 2 || data.gymName.length > 100) {
    errors.gymName = 'Gym name must be 2–100 characters.';
  }
  if (data.ownerName.length < 2 || data.ownerName.length > 80) {
    errors.ownerName = 'Owner name must be 2–80 characters.';
  }
  if (!MOBILE_RE.test(data.mobile)) {
    errors.mobile = 'Enter a valid 10-digit mobile number.';
  }
  if (!EMAIL_RE.test(data.email) || data.email.length > 254) {
    errors.email = 'Enter a valid email address.';
  }
  if (!USER_ID_RE.test(data.userId)) {
    errors.userId = 'User ID must be 4–30 characters: letters, numbers, dot, dash or underscore.';
  }
  if (data.password.length < 8 || !/[a-z]/i.test(data.password) || !/\d/.test(data.password)) {
    errors.password = 'Password must be at least 8 characters with a letter and a number.';
  } else if (data.password.length > 128) {
    errors.password = 'Password must be at most 128 characters.';
  }

  return Object.keys(errors).length ? { errors } : { data };
}
