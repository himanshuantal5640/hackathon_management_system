const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

const validateSignupInput = ({ name, email, password, role }) => {
  const errors = [];
  if (!name || name.trim().length === 0) {
    errors.push('Name is required');
  }
  if (!email || !validateEmail(email)) {
    errors.push('A valid email address is required');
  }
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{6,}$/;
  if (!password || !passwordRegex.test(password)) {
    errors.push('Password must be at least 6 characters long and contain letters, numbers, and special characters (e.g. Pass123!)');
  }

  const allowedRoles = ['admin', 'organizer', 'participant', 'judge'];
  if (role && !allowedRoles.includes(role)) {
    errors.push(`Role must be one of: ${allowedRoles.join(', ')}`);
  }
  return {
    isValid: errors.length === 0,
    errors
  };
};

const validateLoginInput = ({ email, password }) => {
  const errors = [];
  if (!email || !validateEmail(email)) {
    errors.push('A valid email address is required');
  }
  if (!password) {
    errors.push('Password is required');
  }
  return {
    isValid: errors.length === 0,
    errors
  };
};

module.exports = {
  validateEmail,
  validateSignupInput,
  validateLoginInput
};
