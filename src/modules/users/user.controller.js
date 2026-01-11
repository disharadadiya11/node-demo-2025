const userService = require("./user.service");
const asyncHandler = require("../../shared/helpers/asyncHandler");
const { getPaginationParams } = require("../../shared/helpers/pagination");

class UserController {
  register = asyncHandler(async (req, res) => {
    const result = await userService.register(req.body);
    return res.status(result.statusCode).send(result);
  });

  login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const result = await userService.login(email, password);
    return res.status(result.statusCode).send(result);
  });

  getProfile = asyncHandler(async (req, res) => {
    const result = await userService.getProfile(req.user._id);
    return res.status(result.statusCode).send(result);
  });

  updateProfile = asyncHandler(async (req, res) => {
    const result = await userService.updateProfile(req.user._id, req.body);
    return res.status(result.statusCode).send(result);
  });

  changePassword = asyncHandler(async (req, res) => {
    const result = await userService.changePassword(req.user._id, req.body);
    return res.status(result.statusCode).send(result);
  });

  getAllUsers = asyncHandler(async (req, res) => {
    const result = await userService.getAllUsers(req.query);
    return res.status(result.statusCode).json(result);
  });

  getUserById = asyncHandler(async (req, res) => {
    const result = await userService.getUserById(req.params.id);
    return res.status(result.statusCode).send(result);
  });

  updateUser = asyncHandler(async (req, res) => {
    const result = await userService.updateUser(req.params.id, req.body);
    return res.status(result.statusCode).send(result);
  });

  deleteUser = asyncHandler(async (req, res) => {
    const result = await userService.deleteUser(req.params.id);
    return res.status(result.statusCode).send(result);
  });
}

module.exports = new UserController();
