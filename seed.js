import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./src/models/User.js";
import connectDB from "./src/config/database.js";

dotenv.config();

// Conectar ao banco
connectDB();

// Dados de exemplo
const users = [
  {
    name: "Admin User",
    email: "admin@supermercado.com",
    password: "admin123",
    role: "admin",
  },
  {
    name: "João Manager",
    email: "joao@supermercado.com",
    password: "manager123",
    role: "manager",
  },
  {
    name: "Maria Funcionária",
    email: "maria@supermercado.com",
    password: "employee123",
    role: "employee",
  },
];

const importData = async () => {
  try {
    await User.deleteMany();

    await User.create(users);

    console.log("Dados importados com sucesso!");
    console.log("\nUsuários criados:");
    console.log("Admin: admin@supermercado.com / admin123");
    console.log("Manager: joao@supermercado.com / manager123");
    console.log("Employee: maria@supermercado.com / employee123");

    process.exit();
  } catch (error) {
    console.error("Erro ao importar dados:", error);
    process.exit(1);
  }
};

const deleteData = async () => {
  try {
    await User.deleteMany();

    console.log("Dados deletados com sucesso!");
    process.exit();
  } catch (error) {
    console.error("Erro ao deletar dados:", error);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  deleteData();
} else {
  importData();
}
