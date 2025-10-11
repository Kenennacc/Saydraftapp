import { setQueryParam } from "@/misc";
import queryClient from "@/queryClient";
import { createChat } from "@/services/chat";
import { Button } from "@heroui/button";
import { Navbar as HeroUINavbar, NavbarContent } from "@heroui/navbar";
import { useMutation } from "@tanstack/react-query";

import { useDisclosure } from "@heroui/modal";
import { ChevronDown, PlusIcon, SidebarIcon, UserIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMediaQuery } from "react-responsive";
import ChatDropdownMenu from "./ChatDropdownMenu";
import Profile from "./Profile";

type Props = {
  chat?: {
    id: string;
    title: string;
  };
  onSidebarClick: () => void;
};

export const Navbar = ({ chat, onSidebarClick }: Props) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { mutate, isPending } = useMutation({
    mutationFn() {
      return createChat();
    },
    async onSuccess(data) {
      setQueryParam(router, params, {
        key: "id",
        value: data.data.id,
      });
      await queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });
  const router = useRouter();
  const params = useSearchParams();
  const isMobile = useMediaQuery({
    query: "(max-width: 640px)",
  });

  return (
    <>
      <HeroUINavbar className="w-full" maxWidth="xl" position="sticky">
        <NavbarContent justify="start">
          <Button
            className="w-0 md:hidden"
            size="sm"
            isIconOnly
            onPress={onSidebarClick}
            variant="light"
          >
            <SidebarIcon size={18} />
          </Button>
          {chat ? (
            <ChatDropdownMenu
              id={chat.id}
              title={chat.title}
              trigger={
                <Button
                  className="flex-1 md:flex-none w-10 justify-start basis-auto md:w-auto"
                  variant="light"
                  endContent={<ChevronDown className="shrink-0" />}
                >
                  <p className="font-bold truncate overflow-x-hidden text-medium">
                    {chat.title}
                  </p>
                </Button>
              }
            />
          ) : null}
        </NavbarContent>
        <NavbarContent justify="end">
          <Button
            isLoading={isPending}
            startContent={<PlusIcon size={16} />}
            isIconOnly={isMobile}
            className="gap-1 bg-[#212121]"
            onPress={() => {
              mutate();
            }}
          >
            <span className="hidden sm:inline">New Chat</span>
          </Button>
          <Profile
            trigger={
              <Button onPress={onOpen} variant="light" isIconOnly>
                <UserIcon />
              </Button>
            }
            backdrop="blur"
            isOpen={isOpen}
            onOpenChange={onOpenChange}
          />
        </NavbarContent>
      </HeroUINavbar>
    </>
  );
};
