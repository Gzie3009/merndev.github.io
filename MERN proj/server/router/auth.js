 const express=require("express");
 const router=express.Router();
 const bcrypt=require("bcryptjs");
 const User=require("../model/userSchema");
 const jwt= require("jsonwebtoken");
 const authenticate=require("./middleware/authenticate.js")
 const cookieParser=require("cookie-parser");
 router.use(cookieParser());
 router.get("/",(req,res)=>{
    res.send("sadasdadadasda home");
 })

//using async await
 router.post("/register",async (req,res)=>{
    const {name,email,phone, work, password, cpassword}=req.body;
    if( !name || !email || !phone || !work || !password || !cpassword){
        return res.status(422).json({error: "pls fill the inputs"})
    }
    try{

        const userExist= await User.findOne({email:email});
        if(userExist){
            return res.status(422).json({error: "email already registered"}); 
        }else if(password!=cpassword){
            return res.status(422).json({error: "password not matching"});
        }
        else{
        const user=new User({name,email,phone, work, password, cpassword});
        // yaha pe middleware
        const userRegister=user.save();
        if(userRegister){
            res.status(201).json({message: "successfull"}); 
        }
    }

    }catch(err){
        console.log(err);
    }
    
 })

 //login route
 router.post("/signin",async (req,res)=>{

    try{
        let token;
        const {email, password}=req.body;
        if(!email || !password){
            return(res.status(400).json({error: " pls filll data"}));
        }
        const userLogin= await User.findOne({email:email});
        if(userLogin){
            const isMatch= await bcrypt.compare(password,userLogin.password);
            token= await userLogin.generateAuthToken();
            // console.log(token);
            

        if(!isMatch){
            res.status(400).json({error: "invalid details"});
        }else{
            res.cookie("jwtoken",token,{
                expires: new Date(Date.now()+25892000000),
                httpOnly:true
            });
            res.status(200).json({message:"user signin succesful"})
        }
        }
        else{
            res.status(400).json({error:"invalid credentials"});
        }
        // console.log(userLogin);
        
            

    }catch(err){
        console.log(err);
    }


 })
//about us ka page
router.get("/about",authenticate,(req,res)=>{
    res.send(req.rootUser);
})
router.get("/getdata",authenticate,(req,res)=>{
    res.send(req.rootUser);
})
//contact ka page
router.post("/contact",authenticate,async (req,res)=>{
    try{
        const {name,email,phone,message}=req.body;
        if(!name || !email || !phone || !message){
            console.log("error in contact form")
            return res.json({error:"plese fill the contact form"});
        }
        const userContact= await User.findOne({_id:req.userID})
        if(userContact){
            const userMessage=await userContact.addMessage(name,email,phone,message);
            await userContact.save();
            res.status(201).json({message:"user Contacted successfully"})
        }
    }catch(e){
        console.log(e)
    }
})

//logout ka page
router.get("/logout",authenticate,(req,res)=>{
    res.clearCookie("jwtoken",{path:"/"});
    res.status(200).send("User Logged Out");
})
 module.exports=router;