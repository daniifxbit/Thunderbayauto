import { Router } from 'express';
import {
  checkPassword,
  clearSessionCookie,
  createSession,
  destroySession,
  isValidSession,
  loginLockedUntil,
  noteLoginFailure,
  noteLoginSuccess,
  sessionToken,
  setSessionCookie,
} from '../lib/auth.js';

export const authRouter = Router();

authRouter.get('/session', (req, res) => {
  res.json({ authenticated: isValidSession(sessionToken(req)) });
});

authRouter.post('/login', (req, res) => {
  const ip = req.ip ?? 'unknown';
  const lockedUntil = loginLockedUntil(ip);
  if (lockedUntil) {
    res.status(429).json({
      error: 'too_many_attempts',
      retryInSeconds: Math.ceil((lockedUntil - Date.now()) / 1000),
    });
    return;
  }

  const password = (req.body as { password?: unknown } | undefined)?.password;
  if (typeof password !== 'string' || !checkPassword(password)) {
    noteLoginFailure(ip);
    res.status(401).json({ error: 'invalid_password' });
    return;
  }

  noteLoginSuccess(ip);
  setSessionCookie(res, createSession());
  res.json({ authenticated: true });
});

authRouter.post('/logout', (req, res) => {
  destroySession(sessionToken(req));
  clearSessionCookie(res);
  res.json({ authenticated: false });
});
