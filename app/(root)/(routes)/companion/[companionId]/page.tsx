
 interface CompanionIdPageProps{
  params:{
    companionId: string;
  };
 }  ;

 import prismadb from "@/lib/prismadb";
 import { auth } from "@clerk/nextjs/server";

import CompanionForms from "./components/companion-form";

const CompanionIdPage = async({

  params
}: CompanionIdPageProps) => {
  //TODO CHECK SUBSCRIPTION
  const{userId} = auth();

  if(!userId){
      return auth().redirectToSignIn();
  }
  
   const companion= await prismadb.companion.findUnique({
    where:{
      id:params.companionId,

    }
   });
   const categories= await prismadb.category.findMany();
  return (
    <CompanionForms
    initialData={companion}
    categories = { categories}
    />
  )
}

export default CompanionIdPage