import { UserRepo } from "@/lib/Repository";
import { NextRequest, NextResponse } from "next/server";

export const POST = async(req:NextRequest)=>{
    try{

        const {name , email , password } = await req.json()

        if(!name||!email||!password){
            return NextResponse.json({
                error:true,
                message:"All fields Required"
            })
        }

        const user = await UserRepo.findOne({
            where:{
                email
            }
        })

        if(!user){
            return 
        }


    }catch(err:any){
        console.log(err.message)

        return NextResponse.json({
            error:true,
            message:"Unable to register"
        },{
            status:500
        })
    }
}