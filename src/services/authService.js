import User from "../models/User.js";
import { generateToken } from "../middleware/authMiddleware.js";

class AuthService {
  async register(userData) {
    const { name, email, password, role } = userData;

    const userExists = await User.findOne({ email });
    if (userExists) {
      const error = new Error("Email já cadastrado");
      error.statusCode = 400;
      throw error;
    }

    if (cpf) {
      const cpfExists = await User.findOne({ cpf });
      if (cpfExists) {
        const error = new Error("CPF já cadastrado");
        error.statusCode = 400;
        throw error;
      }
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || "employee",
      cpf,
    });

    const token = generateToken(user._id);

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        cpf: user.cpf,
      },
      token,
    };
  }

  async login(credentials) {
    const { email, password } = credentials;

    if (!email || !password) {
      const error = new Error("Por favor, forneça email e senha");
      error.statusCode = 400;
      throw error;
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      const error = new Error("Credenciais inválidas");
      error.statusCode = 401;
      throw error;
    }

    if (!user.isActive) {
      const error = new Error(
        "Usuário inativo. Entre em contato com o administrador"
      );
      error.statusCode = 401;
      throw error;
    }

    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      const error = new Error("Credenciais inválidas");
      error.statusCode = 401;
      throw error;
    }

    const token = generateToken(user._id);

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }

  async getMe(userId) {
    const user = await User.findById(userId);

    if (!user) {
      const error = new Error("Usuário não encontrado");
      error.statusCode = 404;
      throw error;
    }

    return user;
  }

  async updatePassword(userId, passwords) {
    const { currentPassword, newPassword } = passwords;

    if (!currentPassword || !newPassword) {
      const error = new Error(
        "Por favor, forneça a senha atual e a nova senha"
      );
      error.statusCode = 400;
      throw error;
    }

    const user = await User.findById(userId).select("+password");

    if (!user) {
      const error = new Error("Usuário não encontrado");
      error.statusCode = 404;
      throw error;
    }

    const isPasswordCorrect = await user.comparePassword(currentPassword);

    if (!isPasswordCorrect) {
      const error = new Error("Senha atual incorreta");
      error.statusCode = 401;
      throw error;
    }

    user.password = newPassword;
    await user.save();

    const token = generateToken(user._id);

    return { token };
  }
}

export default new AuthService();
