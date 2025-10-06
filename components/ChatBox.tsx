import queryClient from "@/queryClient";
import { getChat } from "@/services/chat";
import { ScrollShadow } from "@heroui/scroll-shadow";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import Messages from "./Messages";
import { Navbar } from "./Navbar";
import NoChat from "./NoChat";
import PageSpinner from "./PageSpinner";
import Recorder from "./Recorder";

type Props = {
  onSidebarClick: () => void;
};

export default function Chat({ onSidebarClick }: Props) {
  const params = useSearchParams();
  const chatId = params.get("id");

  const { data, isLoading } = useQuery({
    queryKey: ["chats", chatId],
    enabled: !!chatId,
    async queryFn({ queryKey: [key, id] }) {
      if (!id) return;
      const chat = await getChat(id);
      await queryClient.invalidateQueries({
        queryKey: ["messages"],
      });
      return chat?.data;
    },
  });
  return (
    <section className="h-full w-full flex-1 flex flex-col">
      <Navbar chat={data} onSidebarClick={onSidebarClick} />
      <ScrollShadow className="flex-1 w-full overflow-x-hidden overflow-y-auto">
        {isLoading ? (
          <PageSpinner />
        ) : !data ? (
          <NoChat />
        ) : (
          <Messages chatId={data!.id} />
        )}
      </ScrollShadow>
      {chatId && data?.state === "MIC" ? <Recorder chatId={chatId} /> : null}
    </section>
  );
}
