import express from "express";
import { deleteUser, getAllUsers, getBookingsByUser, login, signup, updateUser } from "../controllers/user-controller.js";

const userRouter = express.Router();

userRouter.get("/", getAllUsers);
userRouter.post("/signup",signup);
userRouter.put("/:id",updateUser);
userRouter.delete("/:id",deleteUser);
userRouter.post("/login",login);
userRouter.get("/bookings/:id",getBookingsByUser);

export default userRouter;