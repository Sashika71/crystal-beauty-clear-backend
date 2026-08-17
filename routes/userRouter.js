import express, { Router } from "express";
import { loginUser, saveUser,googleLogin } from "../controller/userControll.js";
const userRouter=express.Router();

userRouter.post("/",saveUser);
userRouter.post("/login",loginUser);
userRouter.post("/google",googleLogin);


 export  default userRouter;
