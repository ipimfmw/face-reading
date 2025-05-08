"use client"

import Chat from "@/components/Chat";
import Image from "next/image";
import { useState } from "react";
export default function Home() {
  const [isHovering, setIsHovering] = useState(false);
  return (
    <main className="container flex flex-col mx-auto py-2 px-4 h-screen">
      <h1 
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        className="text-2xl cursor-pointer font-bold text-center my-3"
      >
        Screen Saver
      </h1>
      <div className="flex-1 relative">
        <Chat />
        {isHovering && <Image src="/screen_saver.png" alt="screen_saver" fill className={`absolute z-10 top-0 right-0 ${isHovering ? "opacity-100" : "opacity-0"} transition-opacity duration-300`} />}
      </div>
    </main>
  );
}
