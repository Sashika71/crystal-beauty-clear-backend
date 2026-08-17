import User from "../models/user.js";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import axios from "axios";
import dotenv from "dotenv";

export function saveUser(req,res){

    if(req.body.role=='admin'){
        if(req.user==null){
            res.status(403).json({
                message:"please login as admin before creating an admin account"
            });
            return;
        }
         if(req.user.role!='admin'){
             res.status(403).json({
                message:"you are not authorized to create admn account",
            });
            return;
         }
    }
   


   



 



     const hashPassword=bcrypt.hashSync(req.body.password,10)
      const user=new User({
        email:req.body.email,
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        password:hashPassword,
        phone: req.body.phone || "not given",
        role: req.body.role ,
    
      });



      user.save().then( 
        ()=>{
            res.json({
                meassage:"user save succesfully"
            })
        }
      ) .catch(
        ()=>{
            res.json({
                message:"error occured"
            })
        }
      )

    }

 export function loginUser(req,res){

     
    const email=req.body.email;
    const password=req.body.password;

    User.findOne({
        email:email
        

    } )
    .then((user)=>{
        if(user==null){
            res.json({
                message:"user not found"
            })
        }
        else{
            const isPasswordCorrect=bcrypt.compareSync(password,user.password)
            if(isPasswordCorrect){
                // res.json({
                //     message:"laogin succesfull"
                // })
                const UserData={
                    email:user.email,
                    firstName:user.firstName,
                    lastName:user.lastName,
                    phone:user.phone,
                    isDisabled:user.isDisabled,
                    isEmailVerified:user.isEmailVerified,
                    role:user.role,

                }
                const token=jwt.sign(UserData,'random456')
                res.json({
                    message:"Login Succesfull",
                    token:token,
                    user:UserData,
                })

            }
            else{
                res.json({
                    message:"invalid password"
                })
            }
        }
    })
   } 


   export async function googleLogin(req,res){
	const accessToken = req.body.accessToken;

	try{
		const response = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo",{
			headers : {
				Authorization : "Bearer "+accessToken
			}
		})
		
		const user = await User.findOne({
			email : response.data.email
		})
		if(user == null){
			const newUser = new User({
				email : response.data.email,
				firstName : response.data.given_name,
				lastName : response.data.family_name,
				isEmailVerified : true,
				password : accessToken
			})

			await newUser.save()

			const userData = {
				email : response.data.email,
				firstName : response.data.given_name,
				lastName : response.data.family_name,
				role : "user",
				phone : "Not given",
				isDisabled : false,
				isEmailVerified : true
			}

			const token = jwt.sign(userData,process.env.JWT_KEY,{
				expiresIn : "48hrs"
			})

			res.json({
				message: "Login successful",
				token: token,
				user : userData
			});
			
		}else{
			const userData = {
				email: user.email,
				firstName: user.firstName,
				lastName: user.lastName,
				role: user.role,
				phone: user.phone,
				isDisabled: user.isDisabled,
				isEmailVerified: user.isEmailVerified
			}

			const token = jwt.sign(userData,process.env.JWT_KEY,{
				expiresIn : "48hrs"
			})

			res.json({
				message: "Login successful",
				token: token,
				user : userData
			});
		}
	}catch(e){
		res.status(500).json({
			message : "Google login failed"
		})
	}

}