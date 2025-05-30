import asyncHandler from "express-async-handler";
import { PrismaClient } from "@prisma/client";
import { verifyAccessToken } from "../core/tokenJWT.js";

const prisma = new PrismaClient();

const roleMiddleWare = (requiredRole) => asyncHandler(async (req, res, next) => {
    const token = req.cookies["accessToken"];
    if (!token) {
        return res.status(401).json({ message: "Access token not found in cookies" });
    }
    const decodedToken = await verifyAccessToken(token);
    if (!decodedToken) {
        return res.status(401).json({ message: "Invalid token" });
    }
    const user = await prisma.user.findUnique({
        where: { id: decodedToken.id },
    });
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    if (user.role !== requiredRole) {
        return res.status(403).json({ message: "Forbidden: insufficient role" });
    }
    req.user = user;
    next();
});

export {roleMiddleWare};