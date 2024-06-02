import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user-routes.js";
import adminRouter from "./routes/admin-routes.js";
import movieRouter from "./routes/movie-routes.js";
import bookingsRouter from "./routes/booking-routes.js";
// C:\Users\Lenovo\OneDrive\Desktop\Madhur\DevSoc\Module 3 Backend New\Backend\routes
const app = express();
dotenv.config();

//middlewares
app.use(express.json());
app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/movie",movieRouter);
app.use("/booking",bookingsRouter);


// some issue with dot env
mongoose.connect(`mongodb+srv://admin:${process.env.MONGODB_PASSWORD}@cluster0.v3b0ca2.mongodb.net/`).then(
    ()=>
    app.listen(5000,()=>{
    console.log("Connected to Database and server is running")
})
).catch((e) => console.log(e));


