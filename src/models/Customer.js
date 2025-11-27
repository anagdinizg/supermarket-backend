import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Nome é obrigatório"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email é obrigatório"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    cpf: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

customerSchema.index({ email: 1 });
customerSchema.index({ cpf: 1 });
customerSchema.index({ active: 1 });

const Customer = mongoose.model("Customer", customerSchema);

export default Customer;
