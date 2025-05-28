import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./src/modules/authentification/auth.route.js"; 

dotenv.config();


const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("🚀 API de réservation de parking en ligne !");
});




// Démarre le serveur et crée le compte secrétaire si nécessaire
app.listen(3000, async () => {
  console.log(`✅ Serveur démarré sur http://localhost:${3000}`);
});
