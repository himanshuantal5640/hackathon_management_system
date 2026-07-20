const jwt = require('jsonwebtoken');

const generateTokenAndSetCookie = (res, userId, role) => {
  const token = jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET || 'super_secret_jwt_key_hackathon_platform_2026_change_in_production',
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );

  const cookieOptions = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax'
  };

  res.cookie('token', token, cookieOptions);
  return token;
};

module.exports = generateTokenAndSetCookie;
