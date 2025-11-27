import customerService from "../services/customerService.js";

export const getAllCustomers = async (req, res) => {
  try {
    const customers = await customerService.getAllCustomers(req.user.role);

    res.status(200).json({
      success: true,
      data: customers,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getCustomerById = async (req, res) => {
  try {
    const customer = await customerService.getCustomerById(
      req.params.id,
      req.user.role
    );

    res.status(200).json({
      success: true,
      customer,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

export const createCustomer = async (req, res) => {
  try {
    const customer = await customerService.createCustomer(
      req.body,
      req.user.role
    );

    res.status(201).json({
      success: true,
      message: "Cliente criado com sucesso",
      customer,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateCustomer = async (req, res) => {
  try {
    const customer = await customerService.updateCustomer(
      req.params.id,
      req.body,
      req.user.role
    );

    res.status(200).json({
      success: true,
      message: "Cliente atualizado com sucesso",
      customer,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteCustomer = async (req, res) => {
  try {
    const result = await customerService.deleteCustomer(
      req.params.id,
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
