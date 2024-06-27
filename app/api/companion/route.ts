import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function POST(req: Request){
    try{
        const body= await req.json();
        const user=await currentUser();
        const{ src, name, description,instruction,seed,categoryId} =body;
        if(!user||!user.id||!user.firstName){
            return new NextResponse("Unauthorized",{status:401});
        }
        if(!src||!name||!description||!instruction||!seed||!categoryId){
            return new NextResponse("Missing required fields",{status:400});
        }

        //TODO: CHECK FOR SUBSCRIPTION

        const companion= await prisma.companion.create({
            data:{
               categoryId,
               userId: user.id,
               userName:user.firstName,
               src,
               name,
               description,
               instruction,
               seed
            }
        });

        return NextResponse.json(companion);

    } catch(error){
        console.log("[COMPANION_POST]", error);
        return new NextResponse("Internal Error")
    }
}