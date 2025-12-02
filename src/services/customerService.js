import Customer from "../models/Customer.js";

class CustomerService {
  async getAllCustomers(userRole) {
    if (!["admin", "manager", "employee"].includes(userRole)) {
      const error = new Error(
        "Apenas admin, manager e employee podem visualizar clientes"
      );
      error.statusCode = 403;
      throw error;
    }

    const customers = await Customer.find({ active: true }).sort({
      createdAt: -1,
    });

    return customers;
  }

  async getCustomerById(customerId, userRole) {
    if (!["admin", "manager", "employee"].includes(userRole)) {
      const error = new Error(
        "Apenas admin, manager e employee podem visualizar clientes"
      );
      error.statusCode = 403;
      throw error;
    }

    const customer = await Customer.findById(customerId);

    if (!customer) {
      const error = new Error("Cliente não encontrado");
      error.statusCode = 404;
      throw error;
    }

    if (!customer.active) {
      const error = new Error("Cliente não está mais ativo");
      error.statusCode = 404;
      throw error;
    }

    return customer;
  }

  async createCustomer(customerData, userRole) {
    if (!["admin", "manager", "employee"].includes(userRole)) {
      const error = new Error(
        "Apenas admin, manager e employee podem criar clientes"
      );
      error.statusCode = 403;
      throw error;
    }

    const { name, email, phone, cpf, address, age } = customerData;

    if (!name || !email) {
      const error = new Error("Nome e email são obrigatórios");
      error.statusCode = 400;
      throw error;
    }

    const existingCustomer = await Customer.findOne({
      email,
      active: true,
    });

    if (existingCustomer) {
      const error = new Error("Email já cadastrado");
      error.statusCode = 409;
      throw error;
    }

    if (cpf) {
      const existingCPF = await Customer.findOne({ cpf, active: true });
      if (existingCPF) {
        const error = new Error("CPF já cadastrado");
        error.statusCode = 409;
        throw error;
      }
    }

    if (age !== undefined && age !== null && (age < 1 || age > 150)) {
      const error = new Error("Idade deve estar entre 1 e 150 anos");
      error.statusCode = 400;
      throw error;
    }

    try {
      const customer = await Customer.create({
        name,
        email,
        phone,
        cpf,
        address,
        age: age ? parseInt(age) : null,
      });

      return customer;
    } catch (dbError) {
      if (dbError.code === 11000) {
        const field = Object.keys(dbError.keyPattern)[0];
        const error = new Error(
          field === "email"
            ? "Email já cadastrado"
            : field === "cpf"
            ? "CPF já cadastrado"
            : "Dados duplicados"
        );
        error.statusCode = 409;
        throw error;
      }
      throw dbError;
    }
  }

  async updateCustomer(customerId, updateData, userRole) {
    if (!["admin", "manager", "employee"].includes(userRole)) {
      const error = new Error(
        "Apenas admin, manager e employee podem atualizar clientes"
      );
      error.statusCode = 403;
      throw error;
    }

    const { name, email, phone, cpf, address, active, age } = updateData;

    const customer = await Customer.findById(customerId);

    if (!customer) {
      const error = new Error("Cliente não encontrado");
      error.statusCode = 404;
      throw error;
    }

    if (!customer.active) {
      const error = new Error("Não é possível editar um cliente inativo");
      error.statusCode = 400;
      throw error;
    }

    if (email && email !== customer.email) {
      const existingCustomer = await Customer.findOne({
        email,
        active: true,
        _id: { $ne: customerId },
      });
      if (existingCustomer) {
        const error = new Error("Email já cadastrado");
        error.statusCode = 409;
        throw error;
      }
    }

    if (cpf && cpf !== customer.cpf) {
      const existingCPF = await Customer.findOne({
        cpf,
        active: true,
        _id: { $ne: customerId },
      });
      if (existingCPF) {
        const error = new Error("CPF já cadastrado");
        error.statusCode = 409;
        throw error;
      }
    }

    if (age !== undefined && age !== null && (age < 1 || age > 150)) {
      const error = new Error("Idade deve estar entre 1 e 150 anos");
      error.statusCode = 400;
      throw error;
    }

    if (name) customer.name = name;
    if (email) customer.email = email;
    if (phone !== undefined) customer.phone = phone;
    if (cpf !== undefined) customer.cpf = cpf;
    if (address !== undefined) customer.address = address;
    if (typeof active === "boolean") customer.active = active;
    if (age !== undefined && age !== null && age !== "") {
      customer.age = parseInt(age);
    } else if (age === "" || age === null) {
      customer.age = null;
    }

    try {
      await customer.save();
      return customer;
    } catch (dbError) {
      if (dbError.code === 11000) {
        const field = Object.keys(dbError.keyPattern)[0];
        const error = new Error(
          field === "email"
            ? "Email já cadastrado"
            : field === "cpf"
            ? "CPF já cadastrado"
            : "Dados duplicados"
        );
        error.statusCode = 409;
        throw error;
      }
      throw dbError;
    }
  }

  async deleteCustomer(customerId, userRole) {
    if (!["admin", "manager", "employee"].includes(userRole)) {
      const error = new Error(
        "Apenas admin, manager e employee podem deletar clientes"
      );
      error.statusCode = 403;
      throw error;
    }

    const customer = await Customer.findById(customerId);

    if (!customer) {
      const error = new Error("Cliente não encontrado");
      error.statusCode = 404;
      throw error;
    }

    if (!customer.active) {
      const error = new Error("Cliente já está inativo");
      error.statusCode = 400;
      throw error;
    }

    customer.active = false;
    await customer.save();

    console.log(
      `Cliente "${customer.name}" marcado como inativo (soft delete)`
    );

    return { message: "Cliente removido com sucesso" };
  }
}

export default new CustomerService();
