import { Router } from 'express';
import multer from 'multer';
import db, { transaction } from '../db.js';
import { hashPassword } from '../lib/password.js';
import { LOGO_MAX_BYTES, deleteLogo, detectImageType, logoPath, saveLogo } from '../lib/logo-storage.js';
import { validateGymRegistration } from '../lib/validate-gym-registration.js';

const router = Router();

const findEmail = db.prepare('SELECT 1 FROM users WHERE email = ?');
const findUserId = db.prepare('SELECT 1 FROM users WHERE user_id = ?');
const findGymLogo = db.prepare('SELECT logo_file FROM gyms WHERE id = ?');
const insertGym = db.prepare('INSERT INTO gyms (name, logo_file) VALUES (?, ?)');
const insertOwner = db.prepare(`
  INSERT INTO users (gym_id, name, mobile, email, user_id, password_hash, role)
  VALUES (?, ?, ?, ?, ?, ?, 'owner')
`);

const logoUrl = (gymId, logoFile) => (logoFile ? `/api/gyms/${gymId}/logo` : null);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: LOGO_MAX_BYTES, files: 1, fields: 20 },
});

/** Accepts an optional `logo` file; turns multer errors into field errors. */
function acceptLogo(req, res, next) {
  upload.single('logo')(req, res, (err) => {
    if (!err) return next();
    if (err instanceof multer.MulterError) {
      const message =
        err.code === 'LIMIT_FILE_SIZE' ? 'Logo must be 2 MB or smaller.' : 'Upload a single logo image.';
      return res.status(400).json({ message: 'Please fix the highlighted fields.', errors: { logo: message } });
    }
    next(err);
  });
}

/**
 * POST /api/gyms — a gym owner registers their gym and their own login.
 * Accepts JSON, or multipart/form-data when a `logo` image is included.
 */
router.post('/', acceptLogo, async (req, res) => {
  const { data, errors = {} } = validateGymRegistration(req.body);

  const logoType = req.file ? detectImageType(req.file.buffer) : null;
  if (req.file && !logoType) {
    errors.logo = 'Logo must be a PNG, JPG or WebP image.';
  }
  if (Object.keys(errors).length) {
    return res.status(400).json({ message: 'Please fix the highlighted fields.', errors });
  }

  const taken = {};
  if (findEmail.get(data.email)) taken.email = 'An account with this email already exists.';
  if (findUserId.get(data.userId)) taken.userId = 'This user ID is already taken.';
  if (Object.keys(taken).length) {
    return res.status(409).json({ message: 'Some details are already in use.', errors: taken });
  }

  const passwordHash = await hashPassword(data.password);
  const logoFile = req.file ? await saveLogo(req.file.buffer, logoType) : null;

  let result;
  try {
    result = transaction(() => {
      const gym = insertGym.run(data.gymName, logoFile);
      const owner = insertOwner.run(
        gym.lastInsertRowid,
        data.ownerName,
        data.mobile,
        data.email,
        data.userId,
        passwordHash,
      );
      return { gymId: Number(gym.lastInsertRowid), ownerId: Number(owner.lastInsertRowid) };
    });
  } catch (err) {
    if (logoFile) await deleteLogo(logoFile);
    // A concurrent signup can claim the email/user ID between the check above and the insert.
    const field = /UNIQUE constraint failed: users\.(email|user_id)/.exec(err.message)?.[1];
    if (!field) throw err;
    const key = field === 'email' ? 'email' : 'userId';
    return res.status(409).json({
      message: 'Some details are already in use.',
      errors: { [key]: key === 'email' ? 'An account with this email already exists.' : 'This user ID is already taken.' },
    });
  }

  res.status(201).json({
    gym: { id: result.gymId, name: data.gymName, logoUrl: logoUrl(result.gymId, logoFile) },
    owner: { id: result.ownerId, name: data.ownerName, email: data.email, userId: data.userId },
  });
});

/** GET /api/gyms/:id/logo — the gym's logo image (shown in the app after login). */
router.get('/:id/logo', (req, res) => {
  const row = /^\d+$/.test(req.params.id) ? findGymLogo.get(Number(req.params.id)) : undefined;
  if (!row?.logo_file) {
    return res.status(404).json({ message: 'Logo not found.' });
  }

  res.set({
    'Cache-Control': 'public, max-age=86400',
    'X-Content-Type-Options': 'nosniff',
    'Content-Security-Policy': "default-src 'none'",
  });
  res.sendFile(logoPath(row.logo_file));
});

export default router;
