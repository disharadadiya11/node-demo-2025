const User = require("./user.model");
const {
  generateToken,
  hashPassword,
  verifyPassword,
} = require("../../shared/security/encryption");
const {
  errorMessages,
  successMessages,
} = require("../../shared/constants/messages");
const { StatusCodes } = require("http-status-codes");

class UserService {
  /* ==================== AUTH ==================== */

  async register(userData) {
    const { email, password } = userData;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return {
        statusCode: StatusCodes.BAD_REQUEST,
        success: false,
        message: errorMessages.USER_ALREADY_EXISTS,
      };
    }

    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      ...userData,
      password: hashedPassword,
      isActive: true,
    });

    const token = generateToken({ id: user._id, role: user.role });

    return {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: successMessages.REGISTRATION_SUCCESS,
      data: {
        user: user.toJSON(),
        token,
      },
    };
  }

  async login(email, password) {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return {
        statusCode: StatusCodes.UNAUTHORIZED,
        success: false,
        message: errorMessages.INVALID_CREDENTIALS,
      };
    }

    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return {
        statusCode: StatusCodes.UNAUTHORIZED,
        success: false,
        message: errorMessages.INVALID_CREDENTIALS,
      };
    }

    if (!user.isActive) {
      return {
        statusCode: StatusCodes.FORBIDDEN,
        success: false,
        message: errorMessages.UNAUTHORIZED,
      };
    }

    const token = generateToken({ id: user._id, role: user.role });

    return {
      statusCode: StatusCodes.OK,
      success: true,
      message: successMessages.LOGIN_SUCCESS,
      data: {
        user: user.toJSON(),
        token,
      },
    };
  }

  /* ==================== PROFILE ==================== */

  async getProfile(userId) {
    const user = await User.findById(userId);

    if (!user) {
      return {
        statusCode: StatusCodes.NOT_FOUND,
        success: false,
        message: errorMessages.USER_NOT_FOUND,
      };
    }

    return {
      statusCode: StatusCodes.OK,
      success: true,
      message: successMessages.PROFILE_RETRIEVED,
      data: { user },
    };
  }

  async updateProfile(userId, updateData) {
    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    if (!user) {
      return {
        statusCode: StatusCodes.NOT_FOUND,
        success: false,
        message: errorMessages.USER_NOT_FOUND,
      };
    }

    return {
      statusCode: StatusCodes.OK,
      success: true,
      message: successMessages.PROFILE_UPDATED,
      data: { user },
    };
  }

  async changePassword(userId, body) {
    const { currentPassword, newPassword } = body;
    const user = await User.findById(userId).select("+password");

    if (!user) {
      return {
        statusCode: StatusCodes.NOT_FOUND,
        success: false,
        message: errorMessages.USER_NOT_FOUND,
      };
    }

    const isPasswordValid = await verifyPassword(
      currentPassword,
      user.password
    );

    if (!isPasswordValid) {
      return {
        statusCode: StatusCodes.BAD_REQUEST,
        success: false,
        message: errorMessages.PASSWORD_MISMATCH,
      };
    }

    user.password = await hashPassword(newPassword);
    await user.save();

    return {
      statusCode: StatusCodes.OK,
      success: true,
      message: successMessages.PASSWORD_RESET_SUCCESS,
    };
  }

  /* ==================== ADMIN ==================== */

  async getAllUsers(query = {}) {
    const filters = {};

    if (query.role) {
      filters.role = query.role;
    }

    if (query.isActive !== undefined) {
      filters.isActive = query.isActive === "true";
    }

    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find(filters).skip(skip).limit(limit).sort({ createdAt: -1 }),

      User.countDocuments(filters),
    ]);

    return {
      statusCode: StatusCodes.OK,
      success: true,
      message: successMessages.USERS_RETRIEVED,
      data: {
        users,
        meta: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  }

  async getUserById(id) {
    const user = await User.findById(id);

    if (!user) {
      return {
        statusCode: StatusCodes.NOT_FOUND,
        success: false,
        message: errorMessages.USER_NOT_FOUND,
      };
    }

    return {
      statusCode: StatusCodes.OK,
      success: true,
      message: successMessages.USER_RETRIEVED,
      data: { user },
    };
  }

  async updateUser(id, updateData) {
    const user = await User.findByIdAndUpdate(id, updateData, { new: true });

    if (!user) {
      return {
        statusCode: StatusCodes.NOT_FOUND,
        success: false,
        message: errorMessages.USER_NOT_FOUND,
      };
    }

    return {
      statusCode: StatusCodes.OK,
      success: true,
      message: successMessages.USER_UPDATED,
      data: { user },
    };
  }

  async deleteUser(id) {
    const user = await User.findByIdAndUpdate(
      id,
      { deletedAt: new Date() },
      { new: true }
    );

    if (!user) {
      return {
        statusCode: StatusCodes.NOT_FOUND,
        success: false,
        message: errorMessages.USER_NOT_FOUND,
      };
    }

    return {
      statusCode: StatusCodes.OK,
      success: true,
      message: successMessages.USER_DELETED,
    };
  }
}

module.exports = new UserService();
