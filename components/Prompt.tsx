import queryClient from "@/queryClient";
import { selectPrompt, SelectPrompt } from "@/services/chat";
import { Button } from "@heroui/button";
import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";

type Props = {
  messageId: string;
  chatId: string;
  text: string;
  isSelected: boolean;
};

export default function Prompt({ chatId, messageId, text, isSelected }: Props) {
  const { isPending, mutate } = useMutation({
    mutationFn(data: SelectPrompt) {
      return selectPrompt(data);
    },
    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: ["messages", chatId] });
      await queryClient.invalidateQueries({ queryKey: ["chats", chatId] });
      await queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });
  return (
    <Button
      className={clsx(isSelected && "bg-primary")}
      onPress={(e) => mutate({ chatId, messageId, text })}
      variant="flat"
      isLoading={isPending}
      isIconOnly
    >
      {text}
    </Button>
  );
}
