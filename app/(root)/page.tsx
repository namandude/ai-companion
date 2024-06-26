import { Companions } from "@/components/companion";
import { SearchInput } from "@/components/search-inpur"
import { Categories } from "@/components/ui/categories";
import prismadb from "@/lib/prismadb";
interface RootpageProps {
  searchParams:{
    categoryId: string;
    name: string;
  }
}
import { UserButton } from "@clerk/nextjs"
const Rootpage = async({
  searchParams
}:RootpageProps) => {
  const data=await prismadb.companion.findMany({

 
  where:{
    categoryId: searchParams.categoryId,
    name:{
      search:searchParams.name
    }
  },
  orderBy:{
    createdAt:"desc",
  },
  include:{
    _count:{
      select:{
        messages:true
      }
    }
  }
})
  const categories = await prismadb.category.findMany();
  return (
    <div className="pt-6 pl-2   pr-2  h-50% ">
      <SearchInput/>
    <Categories data={categories}/>
    <Companions data={data}/>

    </div>
  )
}

export default Rootpage 