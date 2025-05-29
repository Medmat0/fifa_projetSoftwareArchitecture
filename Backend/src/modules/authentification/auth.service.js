import { PrismaClient } from "@prisma/client";
import { comparePassword } from "../../core/hashPassword.js";
import {
  createAccessToken,
  createRefreshToken, verifyAccessToken,
} from "../../core/tokenJWT.js";

const prisma = new PrismaClient();

/**
 * @desc    Service to handle login logic
 * @param   {string} email
 * @param   {string} password
 * @param   {object} res - Express response to set cookies
 * @returns {object} { status, data }
 */
export const loginUserService = async (email, password, res) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return {
      status: 400,
      data: { message: "Email or password is incorrect." },
    };
  }

  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    return {
      status: 400,
      data: { message: "Email or password is incorrect." },
    };
  }



  const accessToken = await createAccessToken(user.id);
  const refreshToken = await createRefreshToken(user.id);

  // Set cookies
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 90 * 24 * 60 * 60 * 1000,
  });

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  });

  // Remove password before returning user
  const { password: _, ...safeUser } = user;

  return {
    status: 200,
    data: { user: safeUser },
  };
};

export const logoutUserService = async (req, res) => {
    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");

    return {
        status: 200,
        data: { message: "User logged out successfully" },
    };
}




export const checkAuthStatusService = async (accessToken, refreshToken) => {
  if (!accessToken && !refreshToken) {
    return { status: 200, data: { authenticated: false, message: "User not authenticated" } };
  }

  try {
    const decodedToken = await verifyAccessToken(accessToken);
    const user = await prisma.user.findUnique({ where: { id: decodedToken.id } });

    if (!accessToken && refreshToken) {
      return { status: 401, data: { authenticated: false, message: "Access token expired" } };
    }

    if (!user) {
      return { status: 200, data: { authenticated: false, message: "User not found" } };
    }

    return { status: 200, data: { authenticated: true, utilisateur: user } };
  } catch (error) {
    return { status: 200, data: { authenticated: false, message: "Invalid or expired token" } };
  }
};

export const checkRoleService = async (accessToken, refreshToken) => {
  if (!accessToken && !refreshToken) {
    return { status: 200, data: { authenticated: false, message: "User not authenticated" } };
  }

  try {
    const decodedToken = await verifyAccessToken(accessToken);
    const user = await prisma.user.findUnique({ where: { id: decodedToken.id } });

    if (!user) {
      return { status: 200, data: { authenticated: false, message: "User not found" } };
    }

    return { status: 200, data: { authenticated: true, role: user.role } };
  } catch (error) {
    return { status: 200, data: { authenticated: false, message: "Invalid or expired token" } };
  }
};