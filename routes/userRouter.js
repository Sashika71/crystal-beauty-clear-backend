import express, { Router } from "express";
import { loginUser, saveUser } from "../controller/userControll.js";
const userRouter=express.Router();

userRouter.post("/",saveUser);
userRouter.post("/login",loginUser);


 export  default userRouter;
