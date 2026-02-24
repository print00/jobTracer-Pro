import { verifyToken } from '../utils/jwt.js';
import { ApiError } from '../utils/apiError.js';

export const requireAuth = (req, _res, next) => {
  const authHeader = req.headers.authorization;
  const bearer = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  const token = bearer || req.cookies?.token;

  if (!token) {
    return next(new ApiError(401, 'Authentication required'));
  }

  try {
    const payload = verifyToken(token);
    req.user = { id: payload.sub, email: payload.email, name: payload.name };
    next();
  } catch {
    next(new ApiError(401, 'Invalid or expired token'));
  }
};
