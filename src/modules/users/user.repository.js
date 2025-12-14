const User = require('./user.model');

class UserRepository {
  async create(userData) {
    return await User.create(userData);
  }

  async findById(id) {
    return await User.findById(id).select('-password');
  }

  async findByEmail(email) {
    return await User.findOne({ email }).select('+password');
  }

  async findAll(filters = {}, pagination = {}) {
    const { page = 1, limit = 10, skip = 0 } = pagination;
    const query = User.find(filters).select('-password');

    const [data, total] = await Promise.all([
      query.skip(skip).limit(limit).sort({ createdAt: -1 }),
      User.countDocuments(filters),
    ]);

    return { data, total, page, limit };
  }

  async updateById(id, updateData) {
    return await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).select('-password');
  }

  async deleteById(id) {
    return await User.findByIdAndDelete(id);
  }

  async updatePassword(id, hashedPassword) {
    return await User.findByIdAndUpdate(id, {
      password: hashedPassword,
      resetPasswordToken: undefined,
      resetPasswordExpires: undefined,
    });
  }

  async findByResetToken(token) {
    return await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
  }
}

module.exports = new UserRepository();

