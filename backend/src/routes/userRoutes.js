import express from "express";
import { body } from "express-validator";
import { getMe, updateMe } from "../controllers/userController.js";
import auth from "../middleware/auth.js";
import validate from "../middleware/validate.js";

const router = express.Router();

router.get("/me", auth, getMe);

router.put(
  "/me",
  auth,
  [
    body("name").optional().trim().notEmpty().withMessage("Name cannot be empty"),
    body("email").optional().isEmail().withMessage("Valid email is required"),
  ],
  validate,
  updateMe
);

export default router;
