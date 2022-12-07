const express=require("express");
const app=express()
const mongoose=require("mongoose");
const dotenv=require("dotenv");
dotenv.config({path: "./config.env"});
require("./db/conn");
const cookieParser = require('cookie-parser'); 
app.use(cookieParser());
//const User=require("./model/userSchema")

//we use our router file to make our route easy
app.use(express.json());
app.use(require("./router/auth"));



// app.get("/about",(req,res)=>{
//     res.send("Hello about from server");
//     console.log("this is from server", req.cookies);
// })
// app.get("/contact",(req,res)=>{
//     res.send("hello contact");
// })
app.get("/signin",(req,res)=>{
    res.send("hello login");
})
app.get("/signup",(req,res)=>{
    res.send("hello registration");
})
app.listen(8000 || process.env.PORT,()=>console.log(`server is running on http://localhost:8000/`))
