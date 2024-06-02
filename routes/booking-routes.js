import express from "express";
import { deleteBooking, getBookingbyId, newBooking } from "../controllers/booking-controller.js";

const bookingsRouter = express.Router();

bookingsRouter.post("/",newBooking);
bookingsRouter.get("/:id",getBookingbyId);
bookingsRouter.delete("/:id",deleteBooking);

export default bookingsRouter;