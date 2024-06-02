import mongoose from "mongoose";
// import Movie from "./Movie.js";
const adminSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
        minlength: 6,
    },
    addedMovies:[{
        type: mongoose.Types.ObjectId,
        ref: "Movie",
    }]
    
});

export default mongoose.model("Admin", adminSchema);