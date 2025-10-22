"use client";
import ChatBox from "@/components/ChatBox";
import Sidebar from "@/components/Sidebar";
import { Divider } from "@heroui/divider";
import { LottieRef } from "lottie-react";
import { useRef, useState } from "react";
import { useMediaQuery } from "react-responsive";

export default function Chat() {
  const lottieRef = useRef<LottieRef>(null);
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const [collapseSidebar, setCollapsedSidebar] = useState(isMobile);

  return (
    <main className="flex items-stretch h-screen">
      <Sidebar
        isOpen={!collapseSidebar}
        closeSidebar={() => setCollapsedSidebar(true)}
        toggleSidebar={() => {
          setCollapsedSidebar((prev) => !prev)
     
        }}
      />
      <Divider className="hidden lg:block" orientation="vertical" />
      <ChatBox onSidebarClick={() => setCollapsedSidebar((prev) => !prev)} />
    </main>
  );
}
