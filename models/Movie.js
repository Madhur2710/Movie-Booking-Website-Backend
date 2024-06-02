import mongoose from "mongoose";
// import Admin from "./Admin.js";
const movieSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    releaseDate:{
        type: Date,
        required: true,
    },
    featured:{
        type:Boolean
    },
    bookings:[{
        type: mongoose.Types.ObjectId,
        ref:"Booking"
    }],
    admin:{
        type:mongoose.Types.ObjectId, 
        ref:"Admin",
        required:true,
    },
    availableSeats:{
        type: Number,
        required : true
    }
    
});

export default mongoose.model("Movie", movieSchema);