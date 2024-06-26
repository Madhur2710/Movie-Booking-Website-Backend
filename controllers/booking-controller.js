import Bookings from "../models/Bookings.js";
import Movie from "../models/Movie.js";
import User from "../models/User.js";
import mongoose from "mongoose";


export const newBooking = async (req, res, next) => {
    const{ movie, date, seatNumber, user} = req.body;
    
    let existingUser , existingMovie;
    try{
        existingMovie= await Movie.findById(movie);
        existingUser = await User.findById(user);
    }catch(err){
        return console.log(err);
    }
    if(existingMovie.availableSeats==0){
        return res.status(500).json({message:"All seats have been booked"})

    }else{
        if(!existingMovie){
            return res.status(404).json({message:"Movie not found with the given ID"});
        }
        if(!existingUser){
            return res.status(404).json({message:"User not found with the given ID"});
        }

        let booking;

        try{ 
            booking = new Bookings({movie, date: new Date(`${date}`),seatNumber, user,});
            const session = await mongoose.startSession();
            session.startTransaction();
            existingMovie.availableSeats--;
            existingUser.bookings.push(booking);
            existingMovie.bookings.push(booking);
            await existingUser.save({session});
            await existingMovie.save({session});
            await booking.save({session});
            session.commitTransaction();
        }catch(err){
            return console.log(err);
        }
        if(!booking){
            return res.status(500).json({message:"Unable to create a booking"});
        }

        return res.status(201).json({ booking });
    }
};

export const getBookingbyId = async(req,res,next) =>{
    const id = req.params.id;
    let booking;
    try{
        booking = await Bookings.findById(id);
    }catch(err){
        return console.log(err);
    }
    if(!booking){
        return res.status(500).json({message : "Unexpected Error"});
    }
    return res.status(200).json({booking});
};

export const deleteBooking = async(req,res,next)=>{
    const id = req.params.id;
    let booking;
    try{
        booking = await Bookings.findByIdAndDelete(id).populate("user movie");
        // console.log(booking);
        const session = await mongoose.startSession();
        session.startTransaction();
        booking.movie.availableSeats++;
        await booking.user.bookings.pull(booking);
        await booking.movie.bookings.pull(booking);
        await booking.movie.save({session});
        await booking.user.save({session});
        session.commitTransaction();

    }catch(err){
        return console.log(err);
    }
    if(!booking){
        return res.status(500).json({message:"Unable to delete"});
    }
    return res.status(200).json({message:" Successfully deleted"});
}
