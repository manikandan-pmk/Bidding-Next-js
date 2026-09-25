import { DrawParticipantRepo, LuckyDrawRepo } from "@/lib/repository";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (
  req: NextRequest,
  { params }: { params: { id: String } },
) => {
  try {
    const userHeader = req.headers.get("user");
    if (!userHeader) {
      return NextResponse.json(
        {
          error: true,
          message: "Token Not found",
        },
        {
          status: 401,
        },
      );
    }

    // Convert user header into object
    const user = JSON.parse(userHeader);

    if (!user?.id) {
      return NextResponse.json(
        {
          error: true,
          message: "Invalid user information",
        },
        {
          status: 401,
        },
      );
    }


    const {id}  = await params;

    if(!id){
        return NextResponse.json({
            error:true,
            message:"invaild draw id"
        },{
            status:404
        })
    }

    const luckydraw = await LuckyDrawRepo.findOne({
        where:{
            id:String(id)
        },relations:{
            user:true
        }
    })

    if(!luckydraw){
        return NextResponse.json({
            error:true,
            message:"Draw Not Found"
        },{
            status:404
        })
    }

     if (
      luckydraw.user &&
      String(luckydraw.user.id) !== String(user.id)
    ) {
      return NextResponse.json(
        {
          error: true,
          message: "You are not authorized to spin this draw",
        },
        {
          status: 403,
        },
      );
    }

    // Manage Cycle Logics //


    const serverNow = new Date()

    console.log("Server Time : ", serverNow.toISOString())

    const drawStart = new Date(
        luckydraw.createdAt
    )


    const participants = await DrawParticipantRepo.find({
        where:{
            draw:{
                id:String(id)
            },is_Verified:true,
            is_Winned_Participant:false
        }
    })

    if(!participants){
        return NextResponse.json({
            error:true,
            message:"Verfied Participants not found"
        },{
            status:404
        })
    }




  } catch (err: any) {
    console.error(err.message);
    return NextResponse.json({
      error: true,
      message: "Server Error , Can't make Spin",
    });
  }
};
