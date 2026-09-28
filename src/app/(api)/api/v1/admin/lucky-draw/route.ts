import { LuckyDrawRepo } from "@/lib/repository";
import { NextRequest, NextResponse } from "next/server";

export const GET = async(req:NextRequest)=>{
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


        const draws = await LuckyDrawRepo.find({})

        return NextResponse.json({
            error:false,
            message:"Draws Fetched",
            data:draws
        })


    }catch(err:any){
        console.error(err.message)

        return NextResponse.json({
           error:true,
           message:"Unable to fetch draws , Server Error"
        },{
            status:500
        })

    }
}