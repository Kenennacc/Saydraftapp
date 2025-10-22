import { setQueryParam } from "@/misc";
import { useUserInContext } from "@/providers/User";
import { getChats } from "@/services/chat";
import useAdminAccess from "@/hooks/useAdminAccess";
import { Accordion, AccordionItem } from "@heroui/accordion";
import { Button } from "@heroui/button";
import { Image } from "@heroui/image";
import { Link } from "@heroui/link";
import { Listbox, ListboxItem } from "@heroui/listbox";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { EllipsisIcon, ReceiptTextIcon, SidebarIcon, ShieldCheckIcon } from "lucide-react";
import NextLink from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import ChatDropdownMenu from "./ChatDropdownMenu";

type Props = {
  isOpen: boolean;
  closeSidebar: () => void;
  toggleSidebar: () => void;
};

export default function Sidebar({ isOpen, closeSidebar,   toggleSidebar }: Props) {
  const { data, error, isLoading } = useQuery({
    queryKey: ["chats"],
    async queryFn() {
      const response = await getChats();
      return response.data;
    },
  });
  const [selectedIndex, setSelectedIndex] = useState<string | null>(null);
  const user = useUserInContext();
  const { canAccessAdmin } = useAdminAccess();
  const params = useSearchParams();
  const id = params.get("id");
  const router = useRouter();
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  useEffect(() => {
    if (id) {
      setSelectedIndex(id);
    }
  }, [id]);

  return (
    <motion.aside
      animate={!isOpen ? "collapsed" : "visible"}
      initial="visible"
      variants={{
        visible: {
          width: "var(--sidebar-visible-width)",
          opacity: "var(--sidebar-visible-opacity)",
        },
        collapsed: {
          width: "var(--sidebar-collapsed-width)",
          opacity: "var(--sidebar-collapsed-opacity)",
        },
      }}
      className="fixed overflow-y-auto bg-[#0a0908] w-[var(--sidebar-visible-width)] top-0 left-0 md:relative  z-50 overflow-hidden flex flex-col h-full"
    >
      <section className="flex pt-4 px-4 items-center justify-between">
        {isOpen ? (
          <Link as={NextLink} href="/">
            <Image className="shrink-0" width={100} src="/logo.png" />
          </Link>
        ) : null}
        <Button
          className="w-0 cursor-col-resize"
          size="sm"
          isIconOnly
          onPress={toggleSidebar}
          variant="light"
        >
          <SidebarIcon size={18} />
        </Button>
      </section>
      {isOpen ? (
        <section className="mt-12">
          {/* Admin Navigation - Only show for admin users */}
          {canAccessAdmin && (
            <div className="px-4 mb-6">
              <NextLink href="/admin-7XVw3Qq0fwc">
                <Button
                  variant="light"
                  className="w-full justify-start"
                  startContent={<ShieldCheckIcon size={18} />}
                >
                  Admin Dashboard
                </Button>
              </NextLink>
            </div>
          )}
          
          <Accordion
            itemClasses={{
              base: "px-3",
            }}
            className="px-4"
            showDivider={false}
            defaultExpandedKeys={["1"]}
          >
            <AccordionItem
              className="p-0"
              key={"1"}
              title={<p className="font-bold">Recents</p>}
            >
              {data ? (
                <Listbox
                  autoFocus
                  label="Recent Chats"
                  selectionMode="single"
                  selectedKeys={
                    selectedIndex ? new Set([selectedIndex]) : undefined
                  }
                  hideSelectedIcon
                  onSelectionChange={(selection) => {
                    setSelectedIndex(Array.from(selection)[0] as string);
                  }}
                >
                  {data?.map((chat) => {
                    return (
                      <ListboxItem
                        classNames={{
                          base: "data-[hover=true]:bg-[#212121] data-[selected=true]:bg-[#212121] data-[focus=true]:bg-[#212121] data-[pressed=true]:bg-[#212121]",
                        }}
                        description={Intl.DateTimeFormat("en-US", {
                          timeZone: user.timezone,
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }).format(new Date(chat.createdAt))}
                        startContent={<ReceiptTextIcon />}
                        endContent={
                          <ChatDropdownMenu
                            id={chat.id}
                            title={chat.title}
                            trigger={
                              <Button
                                className="p-0"
                                size="sm"
                                isIconOnly
                                variant="light"
                                isDisabled={selectedIndex !== chat.id}
                              >
                                {selectedIndex === chat.id ? (
                                  <EllipsisIcon size={16} />
                                ) : null}
                              </Button>
                            }
                          />
                        }
                        className="truncate my-1"
                        key={chat.id}
                        onPress={() => {
                          // Use chat.id directly instead of selectedIndex
                          setQueryParam(router, params, {
                            key: "id",
                            value: chat.id,
                          });
                          // Close sidebar on mobile when a chat is selected
                          if (isMobile) {
                            closeSidebar();
                          }
                        }}
                      >
                        {chat.title}
                      </ListboxItem>
                    );
                  })}
                </Listbox>
              ) : null}
            </AccordionItem>
          </Accordion>
        </section>
      ) : null}
    </motion.aside>
  );
}
