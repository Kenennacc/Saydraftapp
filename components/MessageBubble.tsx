import { File, Prompt } from "@/services/chat";
import { Button } from "@heroui/button";
import clsx from "clsx";
import { DownloadIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { useMediaQuery } from "react-responsive";
import MessageMenu from "./MessageMenu";
import PromptComponent from "./Prompt";

type Props = {
  id: string;
  chatId: string;
  title: string;
  end?: boolean;
  prompts?: Prompt[];
  files?: File[];
};

export default function MessageBubble({
  id,
  chatId,
  title,
  end,
  files,
  prompts,
}: Props) {
  const [showMenu, setShowMenu] = useState(false);
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  return (
    <div
      onMouseEnter={() => setShowMenu(true)}
      onMouseLeave={() => setShowMenu(false)}
      className={clsx("p-4 flex w-full", end ? "justify-end" : "justify-start")}
    >
      <div
        className={clsx(
          "flex shrink-0 flex-col md:max-w-1/2 w-full gap-1",
          end ? "md:justify-end items-end" : "md:justify-start items-start",
        )}
      >
        <div
          className={clsx(
            "rounded-xl w-full wrap-break-word  relative inline-block p-4",
            !end
              ? "rounded-bl-none bg-[#212121]"
              : " bg-linear-to-br from-[#5940ff] rounded-br-none from-40% to-[#FF705B] ",
          )}
        >
          <ReactMarkdown>{title}</ReactMarkdown>
        </div>
        <div className="flex gap-1 items-center">
          {prompts?.map((prompt) => (
            <PromptComponent
              chatId={chatId}
              messageId={id}
              isSelected={prompt.selected}
              key={prompt.id}
              text={prompt.value}
            />
          ))}
        </div>

        {files?.map((file) => (
          <Button
            key={file.id}
            startContent={<DownloadIcon className="shrink-0" />}
            size="sm"
            as={Link}
            variant="light"
            href={file.url}
            download
            className="truncate max-w-[40%] justify-start "
          >
            Download Contract
          </Button>
        ))}

        {!end && (isMobile || showMenu) ? <MessageMenu /> : null}
      </div>
    </div>
  );
}
