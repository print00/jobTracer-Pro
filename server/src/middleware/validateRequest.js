import { ApiError } from '../utils/apiError.js';

export const validateRequest = (schema) => (req, _res, next) => {
  const parsed = schema.safeParse(req.body);

  if (!parsed.success) {
    const details = parsed.error.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message
    }));

    return next(new ApiError(400, 'Validation failed', details));
  }

  req.body = parsed.data;
  next();
};
