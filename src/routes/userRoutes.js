import express from "express";
import {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  deleteProfileImage,
} from "../controllers/userController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.get("/", authorize("admin", "manager", "employee"), getUsers);
router.put("/me", updateUser);
router.delete("/profile-image", deleteProfileImage);
router.get("/:id", getUser);
router.put("/:id", updateUser);
router.delete("/:id", authorize("admin", "manager"), deleteUser);

export default router;
