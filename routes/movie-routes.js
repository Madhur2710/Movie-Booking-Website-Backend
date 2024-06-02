import express from "express";
import { addMovie, getAllMovies, getMovieById, removeMovieById } from "../controllers/movie-controller.js";
const movieRouter = express.Router();

movieRouter.get("/",getAllMovies);
movieRouter.get("/:id",getMovieById);
movieRouter.post("/",addMovie);
movieRouter.delete("/:id",removeMovieById);


export default movieRouter;