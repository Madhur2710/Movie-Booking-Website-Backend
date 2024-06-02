import jwt from "jsonwebtoken"
import Movie from "../models/Movie.js"
import Admin from "../models/Admin.js"
import mongoose from "mongoose"

 //we have to await for async ig

export const addMovie = async (req, res, next) => {
    const extractedToken = req.headers.authorization.split(" ")[1];  //token is bearer token
    if(!extractedToken && extractedToken.trim() === ""){
        return res.status(404).json({ message: "Token Not Found"});
    }
    
    let adminId;

    //verify token
    jwt.verify(extractedToken, process.env.SECRET_KEY,(err,decrypted)=>{
        if(err){
            return res.status(400).json({ message : `${err.message}`});
        }else{
            adminId = decrypted.id;
            return;
        }
    });

    const { title,description,releaseDate,featured,availableSeats} = req.body;
    if(!title && title.trim()==="" && !description && description.trim()===""){
        return res.status(422).json({ message: "Invalid Inputs"});
    }

    let movie;
    try{
        movie = new Movie({
            title,
            description,
            releaseDate: new Date(`${releaseDate}`),
            featured,
            admin: adminId,
            availableSeats,
        });

        const session = await mongoose.startSession();
        const adminUser = await Admin.findById(adminId);
        session.startTransaction();
        await movie.save({ session });
        adminUser.addedMovies.push(movie);
        await adminUser.save({ session });
        await session.commitTransaction();
    
    } catch (err){
        return console.log(err);
    }

    if(!movie){
        return res.status(500).json({message:"Request Failed"});
    }

    return res.status(201).json({ movie });
};

export const getAllMovies = async(req,res,next)=>{
    let movies; 

    try{
        movies = await Movie.find();
    }catch(err){
        return console.log(err);
    }

    if(!movies){
        return res.status(500).json({message: "Request Failed"});
    }
    return res.status(200).json({movies});
};

export const getMovieById = async (req, res, next) => {
    const id = req.params.id;
    let movie;
    try{
        movie = await Movie.findById(id);
    }catch(err){
        return console.log(err);
    }

    if(!movie){
        return res.status(404).json({message:"Invalid Movie ID"});
    }

    return res.status(200).json({movie});
}

export const removeMovieById = async(req,res,next) => {
    const id = req.params.id;
    let movie;
    let checkbookings;

    try{
        movie = await Movie.findById(id);
        checkbookings = movie.bookings;
    }catch(err){
        return console.log(err);
    }
    if(checkbookings && checkbookings.length!=0){ 
        return res.status(500).json({message:"Movie has been booked by someone and cannot be deleted"});

    }else{
        const extractedToken = req.headers.authorization.split(" ")[1];  //token is bearer token
        if(!extractedToken && extractedToken.trim() === ""){
            return res.status(404).json({ message: "Token Not Found"});
        }   
    
        let adminId;

        //verify token
        jwt.verify(extractedToken, process.env.SECRET_KEY,(err,decrypted)=>{
            if(err){
                return res.status(400).json({ message : `${err.message}`});
            }else{
                adminId = decrypted.id;
                return;
            }
        });


        try{
            movie = await Movie.findByIdAndDelete(id).populate("admin"); // here value of movie has to modified why??
            const session = await mongoose.startSession();
            const admin = await Admin.findById(adminId);
            session.startTransaction();
            admin.addedMovies.pull(movie);
            await admin.save({session});
            session.commitTransaction();
    
        }catch(err){
            return console.log(err);
        }
        if(!movie){
            return res.status(500).json({message:"Unable to delete"});
        }
        return res.status(200).json({message:" Successfully deleted"});
    }
};