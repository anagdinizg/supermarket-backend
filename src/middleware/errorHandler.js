export const errorHandler = (err, req, res, next) => {
  console.error("Erro:", err);

  let error = { ...err };
  error.message = err.message;

  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
    error.message = message;
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    error.message = `${field === "email" ? "Email" : field} já está cadastrado`;
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  if (err.name === "CastError") {
    error.message = "ID inválido";
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  if (err.name === "JsonWebTokenError") {
    error.message = "Token inválido";
    return res.status(401).json({
      success: false,
      message: error.message,
    });
  }

  if (err.name === "TokenExpiredError") {
    error.message = "Token expirado";
    return res.status(401).json({
      success: false,
      message: error.message,
    });
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: error.message || "Erro interno do servidor",
  });
};
