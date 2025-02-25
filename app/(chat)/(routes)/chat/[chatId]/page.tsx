// import prismadb from "@/lib/prismadb";
// import { auth ,redirectToSignIn } from "@clerk/nextjs/server";
// import { redirect } from "next/navigation";
// import ChatClient from "./components/client";



// interface ChatIdPageProps{
//   params :{
//     chatId :string;  }
// }
// const ChatIdPage = ({
//   params
// }: ChatIdPageProps) => {
//   const { userId}=auth();
//   if(!userId){
//     return redirectToSignIn();
//   }
//   const companion = await prismadb.companion.findUnique({
//     where:{
//       id:params.chatId
//     },
//     include:{
//       messages:{
//         orderBy:{
//           createdAt:"asc",
//         },
//         where:{
//           userId,
//         }
//       },
//       _count:{
//         select:{
//           messages :true
//         }
//       }
//     }
//   });
//   if(!companion){
//     return redirect("/")
//   }
//   return (
//     <ChatClient companion={companion}></ChatClient>
//   )
// }

// export default ChatIdPage
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ChatClient from "./components/client";

interface ChatIdPageProps{
  params:{
      chatId: string;
  }
}
const ChatIdPage =async(
  {
      params
  }:ChatIdPageProps
) => {
  const {userId}= auth();

  if(!userId){
      return auth().redirectToSignIn();
  }

  const companion=await prismadb.companion.findUnique({
      where:{
          id: params.chatId            
      },
      include:{
          messages:{
              orderBy:{
                  createdAt: "asc"
              }, where:{
                  userId,
              }
          },
          _count:{
              select:{
                  messages:true
              }
          }
      }
  });

  if(!companion){
      return redirect("/");
  }
  return ( 
      <ChatClient companion={companion}/>
   );
}

export default ChatIdPage;