import { Router } from "express";
import {
  allChats,
  allMessages,
  allUsers,
  getDashboardStats,
  logoutAdmin,
  verifyAdmin,
} from "../controllers/adminController.js";
import { getAdminAuthCookies } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/");
router.get("/verify", verifyAdmin);
router.get("/logout", logoutAdmin);

router.use(getAdminAuthCookies);

router.get("/chats", allChats);
router.get("/users", allUsers);
router.get("/messages", allMessages);
router.get("/admin-dashboard", getDashboardStats);

export default router;
