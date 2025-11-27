import express from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post(
  "/",
  protect,
  authorize("admin", "manager", "employee"),
  createProduct
);
router.put(
  "/:id",
  protect,
  authorize("admin", "manager", "employee"),
  updateProduct
);
router.delete(
  "/:id",
  protect,
  authorize("admin", "manager", "employee"),
  deleteProduct
);

export default router;
