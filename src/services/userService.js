import User from "../models/User.js";

class UserService {
  async getAllUsers(userRole) {
    let query = {};

    if (userRole === "manager") {
      query.role = "employee";
    }

    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 });
    return users;
  }

  async getUserById(userId) {
    const user = await User.findById(userId).select("-password");

    if (!user) {
      const error = new Error("Usuário não encontrado");
      error.statusCode = 404;
      throw error;
    }

    return user;
  }

  async updateUser(userId, updateData, requestingUserId, requestingUserRole) {
    const { name, email, role, isActive, cpf } = updateData;

    const user = await User.findById(userId);

    if (!user) {
      const error = new Error("Usuário não encontrado");
      error.statusCode = 404;
      throw error;
    }

    if (cpf && cpf !== user.cpf) {
      const cpfExists = await User.findOne({
        cpf,
        _id: { $ne: userId },
      });

      if (cpfExists) {
        const error = new Error("CPF já cadastrado");
        error.statusCode = 409;
        throw error;
      }
    }

    const isSelf = userId === requestingUserId.toString();
    const isAdmin = requestingUserRole === "admin";
    const isManager = requestingUserRole === "manager";

    if (!isAdmin && !isManager && !isSelf) {
      const error = new Error("Você só pode editar seu próprio perfil");
      error.statusCode = 403;
      throw error;
    }

    if (isManager && !isSelf && user.role !== "employee") {
      const error = new Error("Manager só pode editar perfis de employees");
      error.statusCode = 403;
      throw error;
    }

    if (role !== undefined || isActive !== undefined) {
      if (isAdmin) {
        if (role !== undefined) user.role = role;
        if (isActive !== undefined) user.isActive = isActive;
      } else if (isManager && user.role === "employee") {
        if (role !== undefined) {
          if (role === "employee" || role === "manager") {
            user.role = role;
          } else {
            const error = new Error(
              "Manager não pode promover employee para admin"
            );
            error.statusCode = 403;
            throw error;
          }
        }
        if (isActive !== undefined) user.isActive = isActive;
      } else if (!isSelf) {
        const error = new Error(
          "Apenas admin e manager podem alterar role ou status de ativo"
        );
        error.statusCode = 403;
        throw error;
      }
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (cpf !== undefined) user.cpf = cpf;

    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;

    return userResponse;
  }

  async deleteUser(userId, requestingUserId, requestingUserRole) {
    if (requestingUserRole === "employee") {
      const error = new Error("Você não tem permissão para deletar usuários");
      error.statusCode = 403;
      throw error;
    }

    if (userId === requestingUserId.toString()) {
      const error = new Error("Você não pode deletar sua própria conta");
      error.statusCode = 400;
      throw error;
    }

    const user = await User.findById(userId);

    if (!user) {
      const error = new Error("Usuário não encontrado");
      error.statusCode = 404;
      throw error;
    }

    if (requestingUserRole === "manager" && user.role !== "employee") {
      const error = new Error("Manager só pode deletar employees");
      error.statusCode = 403;
      throw error;
    }

    await user.deleteOne();

    return { message: "Usuário deletado com sucesso" };
  }
}

export default new UserService();
