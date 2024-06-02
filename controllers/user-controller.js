import User from "../models/User.js";
import bcrypt from "bcryptjs"; 
import Bookings from "../models/Bookings.js";


// async vs sync
//understand this export statement
// gets all users for that specific search ig
export const getAllUsers = async(req, res, next) => {
    let users;
    try{
        users = await User.find();
    } catch (err) {
        return console.log(err);
    }

    if(!users){
        return res.status(500).json({ message : "Unexpected Error Occured" });
    }

    return res.status(200).json({users});
};

export const signup = async (req, res, next) => {
    const { name, email, password} = req.body;
    if(!name && name.trim() === "" && !email && email.trim() === "" && !password && password.trim()===""){
        return res.status(422).json({ message : "Invalid Input"});
    }

    const hashedPassword = bcrypt.hashSync(password);

    let user;
    try{
        user = new User({name, email, password : hashedPassword  });
        user = await user.save();         // check what does await mean
    } catch(err) {
        return console.log(err);
    }
    if(!user){
        return res.status(500).json({ message : "Unexpected Error Occured" });
    }
    res.status(201).json({ user });
};

export const updateUser = async(req, res, next)=>{
    const id = req.params.id;
    const { name, email, password} = req.body;
    if(!name && name.trim() === "" && !email && email.trim() === "" && !password && password.trim()===""){
        return res.status(422).json({ message : "Invalid Input"});
    }
    let user;
    const hashedPassword = bcrypt.hashSync(password);

    try{  
        user= await User.findByIdAndUpdate(id,{name,email,password : hashedPassword});
    } catch(errr){
        console.log(errr);;
    }
    if(!user){
        return res.status(500).json({message: "Something went wrong"});
    }
    return res.status(200).json({message: "Updated Successfully"});
    
}

export const deleteUser = async(req, res, next)=>{
    const id = req.params.id;
    let user;
    try{  
        user= await User.findByIdAndDelete(id);
    } catch(err){
        return console.log(err);
    }
    if(!user){
        return res.status(500).json({message: "Something went wrong"});
    }
    return res.status(200).json({message: "Deleted Successfully"});
};

export const login = async (req, res, next) => {
    const { name, email, password} = req.body;
    if(!name && name.trim() === "" && !email && email.trim() === "" && !password && password.trim()===""){
        return res.status(422).json({ message : "Invalid Input"});
    }

    let existingUser;
    try{
        existingUser = await User.findOne( {email} );
    } catch(err) {
        return console.log(err);
    }

    if(!existingUser){
        return res.status(404).json({ message : "User Not Found"});
    }

    const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);
    if(!isPasswordCorrect){
        return res.status(400).json({ message : "Incorrect Password"});
    }

    return res.status(200).json({ message : "Login Successfull"});
};

export const getBookingsByUser = async(req, res, next) => {
    const id = req.params.id;
    let bookings;
    try{
        bookings = await Bookings.find({user : id});
    }catch(err){
        return console.log(err);
    }
    if(!bookings){
        return res.status(500).json({message:"Unable to get bookings"});
    }
    return res.status(200).json(bookings);
};
