import asyncHandler from "express-async-handler";
import { loginUser } from "./auth.service.js";
import { checkAuthStatusService } from "./auth.service.js";
import { logoutUser } from "./auth.service.js";
import { checkRoleService } from "./auth.service.js";

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

export const logout = asyncHandler(async (req, res) => {

  const result = await logoutUser(req, res);
  res.status(result.status).json(result.data);
});


export const checkAuthStatus = asyncHandler(async (req, res) => {
  const accessToken = req.cookies["accessToken"];
  const refreshToken = req.cookies["refreshToken"];
  const result = await checkAuthStatusService(accessToken, refreshToken);
  res.status(result.status).json(result.data);
});


export const checkRole = asyncHandler(async (req, res) => {
  const accessToken = req.cookies["accessToken"];
    const refreshToken = req.cookies["refreshToken"];
    const result = await checkRoleService(accessToken, refreshToken);
    res.status(result.status).json(result.data);

});


