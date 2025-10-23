import { getMessages } from "@/services/chat";
import { useQuery } from "@tanstack/react-query";
import MessageBubble from "./MessageBubble";
import NoChat from "./NoChat";
import PageSpinner from "./PageSpinner";

type Props = {
  chatId: string;
};

export default function Messages({ chatId }: Props) {
  const { data, isLoading } = useQuery({
    queryKey: ["messages", chatId],
    staleTime: 0, // Always fetch fresh messages
    async queryFn() {
      const data = await getMessages(chatId);
      return data.data;
    },
  });

  if (isLoading) return <PageSpinner />;

  if (data)
    return (
      <div className="flex w-full flex-col px-2 md:px-8">
        {data.length > 0 ? (
          data.map((message) => (
            <MessageBubble
              chatId={chatId}
              prompts={message?.prompts}
              end={!message.assistant}
              key={message.id}
              id={message.id}
              title={message.text}
              files={message.files}
            />
          ))
        ) : (
          <NoChat />
        )}
      </div>
    );
}
