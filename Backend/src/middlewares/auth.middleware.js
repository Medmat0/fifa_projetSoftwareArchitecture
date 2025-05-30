import { verifyAccessToken } from "../core/tokenJWT.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Middleware pour authentifier uniquement les employés
 */
export const employeeAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = await verifyAccessToken(token);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user || user.role !== "EMPLOYEE") {
      return res.status(403).json({ message: "Access denied: Employees only" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
/**
 * Middleware pour authentifier uniquement les secrétaires
 */
export const secretaryAuth = async (req, res, next) => {
  try {
    const token = req.cookies["accessToken"];
    if (!token) {
      return res.status(401).json({ message: "Access token not found in cookies" });
    }
    const decoded = await verifyAccessToken(token);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user || user.role !== "SECRETARY") {
      return res.status(403).json({ message: "Access denied: Secretaries only" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
/**
 * Middleware pour authentifier uniquement les managers
 */
export const managerAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = await verifyAccessToken(token);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user || user.role !== "MANAGER") {
      return res.status(403).json({ message: "Access denied: Managers only" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};