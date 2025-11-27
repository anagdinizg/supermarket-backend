import express from "express";
import {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "../controllers/customerController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.get("/", authorize("admin", "manager", "employee"), getAllCustomers);
router.post("/", authorize("admin", "manager", "employee"), createCustomer);
router.get("/:id", authorize("admin", "manager", "employee"), getCustomerById);
router.put("/:id", authorize("admin", "manager", "employee"), updateCustomer);
router.delete(
  "/:id",
  authorize("admin", "manager", "employee"),
  deleteCustomer
);

export default router;
