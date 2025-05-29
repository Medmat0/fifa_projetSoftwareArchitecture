import express from "express";
import {getEmployeeQueries} from "./employee.queries.controller.js";

const router = express.Router();

router.get("/",getEmployeeQueries);
//router.get(":id",);

export default router;