import express from "express";
import {addAdmin, adminLogin, getAllAdmins } from "../controllers/admin-controller.js";

const adminRouter = express.Router();

adminRouter.get("/", getAllAdmins);
adminRouter.post("/signup",addAdmin);
// adminRouter.put("/:id",updateAdmin);
// adminRouter.delete("/:id",deleteAdmin);
adminRouter.post("/login", adminLogin);

export default adminRouter;