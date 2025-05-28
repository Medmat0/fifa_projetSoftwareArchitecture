import asyncHandler from "express-async-handler";
import { loginUser } from "./auth.service.js";

/**
 * @desc    Handle user login (controller)
 * @route   POST /auth/login
 * @access  Public
 */
export const login = asyncHandler(async (req, res) => {

  const { email, password } = req.body;
  const result = await loginUser(email, password, res);
  res.status(result.status).json(result.data);
  
});
