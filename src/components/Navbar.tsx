"use client"
import { signOut, useSession } from "next-auth/react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LogOut, Settings, User } from "lucide-react";
import { Avatar } from "./ui/avatar";

const Navbar = () => {
    const {data:session} = useSession()
    if (!session || !session.user) {
        return null
    }
    return (
        <nav className="bg-gray-800 text-white p-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <User className="w-6 h-6" />
        <span className="text-lg font-semibold">{session?.user.username}</span>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="cursor-pointer border-2 text-lg font-semibold flex justify-center items-center"> 
          <Avatar className="h-10 w-10">
          {session?.user.username?.split('')[0].toUpperCase()}
          </Avatar>
      </DropdownMenuTrigger>
         <DropdownMenuContent className="w-64 rounded-2xl flex flex-col gap-y-2 pb-3 shadow-lg">
      <div className="flex justify-start gap-x-2 items-center w-full border px-1 py-2 rounded-2xl bg-gray-300">
      <Avatar className="border-2 text-sm w-7 h-7 font-semibold flex justify-center items-center">
      {session?.user.username?.split('')[0].toUpperCase()}
          </Avatar>
          <span className="w-3/4 truncate">{session?.user.email}</span>
      </div>
        <DropdownMenuItem className="flex hover:bg-gray-300 py-3 rounded-xl items-center space-x-2">
          <User className="w-5 h-5" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex hover:bg-gray-300 py-3 rounded-xl items-center space-x-2">
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex hover:bg-gray-300 py-3 rounded-xl items-center space-x-2" onClick={()=>signOut()}>
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
      </DropdownMenu>
    </nav>
    )
}
export default Navbar