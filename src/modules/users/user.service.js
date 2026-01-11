const bcrypt = require("bcryptjs");
const User = require("./user.model");
const { generateToken } = require("../../shared/security/encryption");
const {
  errorMessages,
  successMessages,
} = require("../../shared/constants/messages");

class UserService {
  /* ==================== AUTH ==================== */

  async register(userData) {
    const { email, password } = userData;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error(errorMessages.USER_ALREADY_EXISTS);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      ...userData,
      password: hashedPassword,
      isActive: true,
    });

    const token = generateToken({ id: user._id, role: user.role });

    return {
      user: user.toJSON(),
      token,
      message: successMessages.REGISTRATION_SUCCESS,
    };
  }

  async login(email, password) {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      throw new Error(errorMessages.INVALID_CREDENTIALS);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error(errorMessages.INVALID_CREDENTIALS);
    }

    if (!user.isActive) {
      throw new Error(errorMessages.UNAUTHORIZED);
    }

    const token = generateToken({ id: user._id, role: user.role });

    return {
      user: user.toJSON(),
      token,
      message: successMessages.LOGIN_SUCCESS,
    };
  }

  /* ==================== PROFILE ==================== */

  async getProfile(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error(errorMessages.USER_NOT_FOUND);
    }
    return {
      user,
      message: successMessages.PROFILE_RETRIEVED,
    };
  }

  async updateProfile(userId, updateData) {
    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    if (!user) {
      throw new Error(errorMessages.USER_NOT_FOUND);
    }

    return {
      user,
      message: successMessages.PROFILE_UPDATED,
    };
  }

  async changePassword(userId, currentPassword, newPassword) {
    const user = await User.findById(userId).select("+password");

    if (!user) {
      throw new Error(errorMessages.USER_NOT_FOUND);
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isPasswordValid) {
      throw new Error(errorMessages.PASSWORD_MISMATCH);
    }

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    return {
      message: successMessages.PASSWORD_RESET_SUCCESS,
    };
  }

  /* ==================== ADMIN ==================== */

  async getAllUsers(filters = {}, pagination = {}) {
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find(filters).skip(skip).limit(limit).sort({ createdAt: -1 }),

      User.countDocuments(filters),
    ]);

    return {
      data: users,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getUserById(id) {
    const user = await User.findById(id);
    if (!user) {
      throw new Error(errorMessages.USER_NOT_FOUND);
    }
    return user;
  }

  async updateUser(id, updateData) {
    const user = await User.findByIdAndUpdate(id, updateData, { new: true });

    if (!user) {
      throw new Error(errorMessages.USER_NOT_FOUND);
    }

    return {
      user,
      message: successMessages.USER_UPDATED,
    };
  }

  async deleteUser(id) {
    const user = await User.findByIdAndUpdate(
      id,
      { deletedAt: new Date() },
      { new: true }
    );

    if (!user) {
      throw new Error(errorMessages.USER_NOT_FOUND);
    }

    return {
      message: successMessages.USER_DELETED,
    };
  }
}

module.exports = new UserService();
