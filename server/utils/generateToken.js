import jwt from 'jsonwebtoken';

/**
 * Generate a signed JWT and set it as an HTTP-only cookie on the response.
 * The cookie is the single source of truth for authentication — no tokens
 * are ever sent in response bodies to the client.
 */
export const generateTokenAndSetCookie = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

  res.cookie('jwt', token, {
    httpOnly: true,              // Not accessible via document.cookie
    secure: process.env.NODE_ENV === 'production', // HTTPS only in prod
    sameSite: 'none',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
  });

  return token;
};

export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
