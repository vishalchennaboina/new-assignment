import express from "express";
import { body } from "express-validator";
import {
  createTask,
  deleteTask,
  getTaskById,
  getTasks,
  updateTask,
} from "../controllers/taskController.js";
import auth from "../middleware/auth.js";
import validate from "../middleware/validate.js";

const router = express.Router();

router.use(auth);

router.post(
  "/",
  [body("title").trim().notEmpty().withMessage("Title is required")],
  validate,
  createTask
);

router.get("/", getTasks);
router.get("/:id", getTaskById);

router.put(
  "/:id",
  [
    body("title").optional().trim().notEmpty().withMessage("Title cannot be empty"),
    body("status")
      .optional()
      .isIn(["pending", "completed"])
      .withMessage("Status must be pending or completed"),
  ],
  validate,
  updateTask
);

router.delete("/:id", deleteTask);

export default router;
