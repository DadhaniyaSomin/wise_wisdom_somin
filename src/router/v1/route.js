import express from "express";
import validate from "../../middlewares/validate.js";
import authValidation from '../../validations/auth.validation.js';
import { authService, userService, tokenService, emailService } from "../../services";

const router = express.Router();


router.post(
  "/register",
  validate(authValidation.register),
  authController.register
);

export default router;

