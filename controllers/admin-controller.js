import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs"; 
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();


// async vs sync

export const getAllAdmins = async(req, res, next) => {
    let admins;
    try{
        admins = await Admin.find();
    } catch (err) {
        return console.log(err);
    }

    if(!admins){
        return res.status(500).json({ message : "Unexpected Error Occured" });
    }

    return res.status(200).json({admins});
};

export const addAdmin = async (req, res, next) => {
    const { name, email, password} = req.body;
    if(!name && name.trim() === "" && !email && email.trim() === "" && !password && password.trim()===""){
        return res.status(422).json({ message : "Invalid Input"});
    }

    const hashedPassword = bcrypt.hashSync(password);

    let admin;
    try{
        admin = new Admin({name, email, password : hashedPassword  });
        admin = await admin.save();         // check what does await mean
    } catch(err) {
        return console.log(err);
    }
    if(!admin){
        return res.status(500).json({ message : "Unexpected Error Occured" });
    }
    res.status(201).json({ admin });
};

// export const updateUser = async(req, res, next)=>{
//     const id = req.params.id;
//     const { name, email, password} = req.body;
//     if(!name && name.trim() === "" && !email && email.trim() === "" && !password && password.trim()===""){
//         return res.status(422).json({ message : "Invalid Input"});
//     }
//     let user;
//     const hashedPassword = bcrypt.hashSync(password);

//     try{  
//         user= await User.findByIdAndUpdate(id,{name,email,password : hashedPassword});
//     } catch(errr){
//         console.log(errr);;
//     }
//     if(!user){
//         return res.status(500).json({message: "Something went wrong"});
//     }
//     return res.status(200).json({message: "Updated Successfully"});
    
// }

// export const deleteUser = async(req, res, next)=>{
//     const id = req.params.id;
//     let user;
//     try{  
//         user= await User.findByIdAndDelete(id);
//     } catch(err){
//         return console.log(err);
//     }
//     if(!user){
//         return res.status(500).json({message: "Something went wrong"});
//     }
//     return res.status(200).json({message: "Deleted Successfully"});
// };


// will authenticate even if wrong name is inputed 
export const adminLogin = async (req, res, next) => {
    const { name, email, password} = req.body;
    if(!name && name.trim() === "" && !email && email.trim() === "" && !password && password.trim()===""){
        return res.status(422).json({ message : "Invalid Input"});
    }

    let existingAdmin;
    try{
        existingAdmin = await Admin.findOne( {email} );
    } catch(err) {
        return console.log(err);
    }

    if(!existingAdmin){
        return res.status(404).json({ message : "Admin Not Found"});
    }

    const isPasswordCorrect = bcrypt.compareSync(password, existingAdmin.password);
    if(!isPasswordCorrect){
        return res.status(400).json({ message : "Incorrect Password"});
    }

    const token = jwt.sign({ id: existingAdmin._id }, process.env.SECRET_KEY,{
        expiresIn:"10h",
    })
    return res.status(200).json({ message : "Authentication completed", token, id: existingAdmin._id  });


};
