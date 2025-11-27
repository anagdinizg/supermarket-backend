import userService from "../services/userService.js";

export const getUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers(req.user.role);

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await userService.getUserById(
      req.params.id,
      req.user._id,
      req.user.role
    );

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const userId = req.params.id || req.user._id.toString();

    const user = await userService.updateUser(
      userId,
      req.body,
      req.user._id,
      req.user.role
    );

    res.status(200).json({
      success: true,
      message: "Usuário atualizado com sucesso",
      data: user,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const result = await userService.deleteUser(
      req.params.id,
      req.user._id,
      req.user.role
    );

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

export const uploadProfileImage = async (req, res) => {
  try {
    const userId = req.params.id || req.user._id.toString();

    const result = await userService.uploadProfileImage(
      userId,
      req.file,
      req.user._id,
      req.user.role
    );

    res.status(200).json({
      success: true,
      message: "Foto de perfil atualizada com sucesso",
      data: result,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteProfileImage = async (req, res) => {
  try {
    const userId = req.params.id || req.user._id.toString();

    const result = await userService.deleteProfileImage(
      userId,
      req.user._id,
      req.user.role
    );

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};
