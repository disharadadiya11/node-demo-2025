const {
  getPaginationParams,
  getPaginationMeta,
} = require("../../shared/helpers/pagination");
const userService = require("./user.service");
const asyncHandler = require("../../shared/helpers/asyncHandler");
const { successResponse } = require("../../shared/response/apiResponse");

class UserController {
  register = asyncHandler(async (req, res) => {
    const result = await userService.register(req.body);
    successResponse(res, 201, result.message, result);
  });

  login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const result = await userService.login(email, password);
    successResponse(res, 200, result.message, result);
  });

  getProfile = asyncHandler(async (req, res) => {
    const user = await userService.getProfile(req.user._id);
    successResponse(res, 200, "Profile retrieved successfully", { user });
  });

  updateProfile = asyncHandler(async (req, res) => {
    const result = await userService.updateProfile(req.user._id, req.body);
    successResponse(res, 200, result.message, result);
  });

  changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const result = await userService.changePassword(
      req.user._id,
      currentPassword,
      newPassword
    );
    successResponse(res, 200, result.message);
  });

  getAllUsers = asyncHandler(async (req, res) => {
    const pagination = getPaginationParams(req);
    const filters = {};

    if (req.query.role) filters.role = req.query.role;
    if (req.query.isActive !== undefined)
      filters.isActive = req.query.isActive === "true";

    const { data, total } = await userService.getAllUsers(filters, pagination);
    const meta = getPaginationMeta(pagination.page, pagination.limit, total);

    successResponse(res, 200, "Users retrieved successfully", {
      users: data,
      meta,
    });
  });

  getUserById = asyncHandler(async (req, res) => {
    const user = await userService.getUserById(req.params.id);
    successResponse(res, 200, "User retrieved successfully", { user });
  });

  updateUser = asyncHandler(async (req, res) => {
    const result = await userService.updateUser(req.params.id, req.body);
    successResponse(res, 200, result.message, result);
  });

  deleteUser = asyncHandler(async (req, res) => {
    const result = await userService.deleteUser(req.params.id);
    successResponse(res, 200, result.message);
  });
}

module.exports = new UserController();
