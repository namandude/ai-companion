"use client";

import { Menu , Sparkles} from "lucide-react";
import { Poppins } from "next/font/google";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { ModeToggle } from "./mode-toggle";
import MobileSidebar from "./mobile-sidebar";
const font =Poppins({
  weight:"600",
  subsets:['latin']
});
export const Navbar =() =>{
  return(
  
    <div className="flex items-center justify-between w-full bg-secondary border-b border-primary/10 h-16 pt-2 pb-2 px-4">
  <div className="flex items-center">
    <MobileSidebar/>
    <Menu className="block md:hidden" />
    <Link href={'/'}>
      <h1 className={cn(
        "text-xl md:text-2xl font-bold text-primary hidden md:block", // Default ClassName
        font.className // Dynamic ClassName
      )}>companion-ai</h1>
    </Link>
  </div>
  <div className="flex items-center gap-x-3">
    <Button className="ml-auto " size="sm" variant="premium">Upgrade <Sparkles /></Button>
    <ModeToggle></ModeToggle>
    <UserButton />
  </div>
</div>

  )
}