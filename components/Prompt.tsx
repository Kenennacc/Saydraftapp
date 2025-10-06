import queryClient from "@/queryClient";
import { selectPrompt, SelectPrompt } from "@/services/chat";
import { Button } from "@heroui/button";
import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";

type Props = {
  messageId: string;
  chatId: string;
  value: string;
  isSelected: boolean;
};

export default function Prompt({
  chatId,
  messageId,
  value,
  isSelected,
}: Props) {
  const { isPending, mutate } = useMutation({
    mutationFn(data: SelectPrompt) {
      return selectPrompt(data);
    },
    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: ["messages"] });
      await queryClient.invalidateQueries({ queryKey: ["chats", chatId] });
    },
  });
  return (
    <Button
      className={clsx(isSelected && "bg-primary")}
      onPress={(e) => mutate({ chatId, messageId, value })}
      variant="flat"
      isLoading={isPending}
      isIconOnly
    >
      {value}
    </Button>
  );
}
