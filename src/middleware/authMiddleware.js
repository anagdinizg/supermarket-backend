import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Não autorizado, token não encontrado",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Usuário não encontrado",
      });
    }

    if (!req.user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Usuário inativo",
      });
    }

    next();
  } catch (error) {
    console.error("Erro na autenticação:", error);
    return res.status(401).json({
      success: false,
      message: "Token inválido ou expirado",
    });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Usuário com role '${req.user.role}' não tem permissão para acessar esta rota`,
      });
    }
    next();
  };
};

export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};
