const mongoose=require("mongoose");
const DB=process.env.DATABASE;
mongoose.connect(DB,{useNewUrlParser:true}).then(()=>console.log("connection succesfull")).catch((err)=> console.log(err));