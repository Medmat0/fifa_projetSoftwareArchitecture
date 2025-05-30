import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import reservationRoutes from "./src/modules/employee/reservation/reservationEmployee.route.js";
import cors from "cors";
import authRoutes from "./src/modules/authentification/auth.route.js";
import secretaryRoutes from "./src/modules/secretary/secretary.route.js";
import slotsRoutes from './src/modules/system/listSlots.route.js'
import managerRoutes from './src/modules/manager/reservation/reservationManager.route.js';
dotenv.config();


const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:4300',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use("/auth", authRoutes);
app.use("/secretary",secretaryRoutes)
app.use("/reservationManager", managerRoutes);
app.use("/reservation", reservationRoutes);
app.use("/mapStatus", slotsRoutes);
app.get("/", (req, res) => {
  res.send("🚀 API de réservation de parking en ligne !");
});




// Démarre le serveur et crée le compte secrétaire si nécessaire
app.listen(3000, async () => {
  console.log(`✅ Serveur démarré sur http://localhost:${3000}`);
});
