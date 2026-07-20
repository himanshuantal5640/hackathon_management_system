const User = require('../models/User');
const generateTokenAndSetCookie = require('../utils/generateToken');
const { validateSignupInput, validateLoginInput, validateEmail } = require('../utils/validators');

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
const signup = async (req, res, next) => {
  try {
    const { name, email, password, role, profileImage } = req.body;

    // Validate inputs
    const { isValid, errors } = validateSignupInput({ name, email, password, role });
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: errors.join(', ')
      });
    }

    // Check duplicate email
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists'
      });
    }

    // Create User
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: role || 'participant',
      profileImage: profileImage || undefined
    });

    // Generate Token & set cookie
    const token = generateTokenAndSetCookie(res, user._id, user.role);

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: user.toSafeObject()
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate inputs
    const { isValid, errors } = validateLoginInput({ email, password });
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: errors.join(', ')
      });
    }

    // Check for user (select password explicitly)
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if blocked
    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been suspended. Please contact support.'
      });
    }

    // Generate Token & set cookie
    const token = generateTokenAndSetCookie(res, user._id, user.role);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: user.toSafeObject()
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found'
      });
    }

    res.status(200).json({
      success: true,
      user: user.toSafeObject()
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update current user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found'
      });
    }

    const { name, email, profileImage, password } = req.body;

    if (name) user.name = name;
    
    if (email && email.toLowerCase() !== user.email) {
      if (!validateEmail(email)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid email address'
        });
      }
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'Email address is already in use by another account'
        });
      }
      user.email = email.toLowerCase();
    }

    if (profileImage) user.profileImage = profileImage;

    if (password) {
      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 6 characters long'
        });
      }
      user.password = password;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser.toSafeObject()
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Log out user / clear cookie
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res, next) => {
  try {
    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 5 * 1000), // 5 seconds
      httpOnly: true
    });

    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  login,
  getProfile,
  updateProfile,
  logout
};
