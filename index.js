import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import userRouter from './routes/userRouter.js';
import jwt from 'jsonwebtoken';
import productRouter from './routes/productRouter.js';
import { verifyJWT } from './middlewear/auth.js';
import orderRouter from './routes/orderRouter.js';

 
mongoose.connect("mongodb+srv://admin:20020701@cluster0.ux3l1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0").then(
    ()=>{
        console.log('connected to mongodb');
    }
)
.catch(
    ()=>{
        console.log("connection failed");
    }
)



let app=express();
app.use(bodyParser.json());
app.use(verifyJWT);


app.use("/api/user",userRouter);
app.use('/api/product',productRouter);
app.use('/api/order',orderRouter);

app.get('/',
    (req,res)=>{
        Student.find().then(
            (students)=>{
                res.json(students)
            }
        )
        .catch(()=>{
            res.json(
                {
                    message:"error occured"
                }
            )
        })
     
})

app.post('/',
    (req,res)=>{
         const student=new Student(req.body);
          student.save().then(
            ()=>{
                res.json(
                    {
                        message:"student saved"
                    }
                )
            }
          )
          .catch(
            ()=>{
                res.json(
                    {
                        message:"student ot saved"
                    }
                )
            }
          )
   
           
            
          
    }
)




app.listen(5000,()=>{

    console.log('server is running on port 5000');
})