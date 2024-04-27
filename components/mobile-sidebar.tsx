import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import Sidebar from "./sidebar"
const MobileSidebar = () => {
  return (<Sheet>
    <SheetTrigger className="md:hidden pr-4">
      <Menu/>
    </SheetTrigger>
    <SheetContent side="left" className=" "
  </Sheet>
  )
}

export default MobileSidebar