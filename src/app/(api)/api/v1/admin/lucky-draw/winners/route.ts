import { DrawWinnerRepo } from "@/lib/repository";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req:NextRequest)=>{
    try{

        const adminHeader = req.headers.get("admin")

        if(!adminHeader){
            return NextResponse.json({
                error:true,
                message:"token not found"
            },{
                status:404
            })
        }

        const adminDetails = JSON.parse(adminHeader)

        if(adminDetails.role !== "admin"){
            return NextResponse.json({
                error:true,
                message:"Unauthorized"
            },{
                status:401
            })
        }

        const winners = await DrawWinnerRepo.find({
            relations:{
                draw:true,
                participant:true
            }
        })

        if(!winners){
            return NextResponse.json({
                error:true,
                message:"No winners Here"
            },{
                status:404
            })
        }

        return NextResponse.json({
            error:false,
            message:"Winners Fetched",
            data:winners
        })


    }catch(err:any){
        console.log(err.message)

        return NextResponse.json({
            error:true,
            message:"Unable to fetch winners , Server Error"
        },{
            status:500
        })
    }
}