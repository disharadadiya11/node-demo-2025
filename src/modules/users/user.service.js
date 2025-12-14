const jwt = require("jsonwebtoken");
const { JWT_SECRET, JWT_EXPIRE } = require("../../config/env");
const { hashPassword, verifyPassword } = require("../../utils/encryption");
const { generateToken } = require("../../utils/encryption");
const userRepository = require("./user.repository");
const { errorMessages, successMessages } = require("../../messages");

class UserService {
  async register(userData) {
    const { email, password } = userData;

    // Check if user exists
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error(errorMessages.USER_ALREADY_EXISTS);
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await userRepository.create({
      ...userData,
      password: hashedPassword,
      emailVerificationToken: generateToken(),
    });

    // Generate token
    const token = this.generateToken(user._id);

    return {
      user: user.toJSON(),
      token,
      message: successMessages.REGISTRATION_SUCCESS,
    };
  }

  async login(email, password) {
    // Find user with password
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new Error(errorMessages.INVALID_CREDENTIALS);
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error(errorMessages.INVALID_CREDENTIALS);
    }

    // Check if user is active
    if (!user.isActive) {
      throw new Error(errorMessages.UNAUTHORIZED);
    }

    // Generate token
    const token = this.generateToken(user._id);

    return {
      user: user.toJSON(),
      token,
      message: successMessages.LOGIN_SUCCESS,
    };
  }

  async getProfile(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error(errorMessages.USER_NOT_FOUND);
    }
    return user;
  }

  async updateProfile(userId, updateData) {
    const user = await userRepository.updateById(userId, updateData);
    if (!user) {
      throw new Error(errorMessages.USER_NOT_FOUND);
    }
    return {
      user,
      message: successMessages.PROFILE_UPDATED,
    };
  }

  async changePassword(userId, currentPassword, newPassword) {
    const user = await userRepository.findByEmail(
      (
        await userRepository.findById(userId)
      ).email
    );

    if (!user) {
      throw new Error(errorMessages.USER_NOT_FOUND);
    }

    // Verify current password
    const isPasswordValid = await verifyPassword(
      currentPassword,
      user.password
    );
    if (!isPasswordValid) {
      throw new Error(errorMessages.PASSWORD_MISMATCH);
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);
    await userRepository.updatePassword(userId, hashedPassword);

    return { message: successMessages.PASSWORD_RESET_SUCCESS };
  }

  async getAllUsers(filters, pagination) {
    return await userRepository.findAll(filters, pagination);
  }

  async getUserById(id) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new Error(errorMessages.USER_NOT_FOUND);
    }
    return user;
  }

  async updateUser(id, updateData) {
    const user = await userRepository.updateById(id, updateData);
    if (!user) {
      throw new Error(errorMessages.USER_NOT_FOUND);
    }
    return {
      user,
      message: successMessages.USER_UPDATED,
    };
  }

  async deleteUser(id) {
    const user = await userRepository.deleteById(id);
    if (!user) {
      throw new Error(errorMessages.USER_NOT_FOUND);
    }
    return { message: successMessages.USER_DELETED };
  }

  generateToken(userId) {
    return jwt.sign({ id: userId }, JWT_SECRET, {
      expiresIn: JWT_EXPIRE,
    });
  }
}

module.exports = new UserService();
