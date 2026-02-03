const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const db=require("./db");
    const express=require("express");
      
    const router=express.Router();
    router.post("/register",async(req,res)=>{
        const {full_name,email,username,password}=req.body;

        try{
            const hashedPassword=await bcrypt.hash(password,10);
            const query=("INSERT INTO users (full_name,email,username,password) VALUES (?,?,?,?)",[full_name,email,username,hashedPassword]);
            db.execute(query,[full_name,email,username,hashedPassword],(err,result)=>{
                if(err)res.status(500).json({message:"Database error"});

                res.status(201).json({
                    results,
                    "message":"User created successfully"
                   })
                })
        }catch(err){

        }
    });


module.exports=router;