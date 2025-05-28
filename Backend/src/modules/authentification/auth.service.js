import { PrismaClient } from "@prisma/client";
import { comparePassword } from "../../core/hashPassword.js";
import {
  createAccessToken,
  createRefreshToken,
} from "../../core/tokenJWT.js";

const prisma = new PrismaClient();

/**
 * @desc    Service to handle login logic
 * @param   {string} email
 * @param   {string} password
 * @param   {object} res - Express response to set cookies
 * @returns {object} { status, data }
 */
export const loginUser = async (email, password, res) => {
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

  const accessToken = createAccessToken(user.id);
  const refreshToken = createRefreshToken(user.id);

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
