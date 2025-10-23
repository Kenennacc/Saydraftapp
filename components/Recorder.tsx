import { secondsToTime, tap } from "@/misc";
import { formatApiError } from "@/misc/errors";
import queryClient from "@/queryClient";
import { createChat, listenToAudio } from "@/services/chat";
import { Button } from "@heroui/button";
import { addToast } from "@heroui/toast";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { MicIcon, SendHorizonalIcon, XIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Props = {
  chatId?: string | null;
};

export default function Recorder({ chatId }: Props) {
  const router = useRouter();
  const params = useSearchParams();
  const [isRecording, setIsRecording] = useState(false);
  const [pendingChatId, setPendingChatId] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const trashRef = useRef(false);
  const [seconds, setSeconds] = useState(0);

  const createChatMutation = useMutation({
    mutationFn: createChat,
    onSuccess: async (response) => {
      const newChatId = response.data.id;
      setPendingChatId(newChatId);
      
      // Update URL with new chat ID
      const url = new URL(window.location.href);
      url.searchParams.set("id", newChatId);
      router.push(url.pathname + url.search);
      
      await queryClient.invalidateQueries({
        queryKey: ["chats"],
      });
    },
    onError(err) {
      const message = formatApiError(err as Error);
      addToast({
        description: message,
        color: "danger",
      });
    },
  });

  // Auto-start recording after chat is created
  useEffect(() => {
    if (pendingChatId && chatId === pendingChatId && !isRecording) {
      setPendingChatId(null);
      record();
    }
  }, [pendingChatId, chatId, isRecording]);

  const { mutate, isPending } = useMutation({
    mutationFn(data: Blob) {
      if (!chatId) throw new Error("Chat ID is required");
      return listenToAudio(data, chatId);
    },
    async onSuccess() {
      await queryClient.invalidateQueries({
        queryKey: ["messages", chatId],
      });
      await queryClient.invalidateQueries({
        queryKey: ["chats"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["chats", chatId],
      });
    },
    onError(err) {
      const message = formatApiError(err as Error);
      addToast({
        description: message,
        color: "danger",
      });
    },
  });

  const variant = {
    initial: {
      width: 0,
      opacity: 0,
    },
    recording: isRecording
      ? {
          width: "auto",
          opacity: 1,
        }
      : { width: 0, opacity: 0 },
  };

  const interval = () => {
    setSeconds((prev) => prev + 1);
  };

  const record = async () => {
    try {
      if (isPending) return;

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });

      streamRef.current = stream;

      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: "audio/webm",
      });

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        if (audioChunksRef.current.length === 0) return;
        if (!trashRef.current) {
          const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
          await mutate(
            new File(
              [blob!],
              `voice_${Date.now()}.${blob.type.split("/")[1]}`,
              {
                type: blob.type,
              },
            ),
          );
        }
        audioChunksRef.current = [];
        if (trashRef.current) trashRef.current = false;
      };
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.log("Media error: ", err);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    streamRef.current?.getTracks().forEach((track) => track.stop());
    setIsRecording(false);
  };

  useEffect(() => {
    if (!isRecording) {
      setSeconds(0);
      return;
    }
    const id = setInterval(interval, 1000);
    return () => {
      clearInterval(id);
    };
  }, [isRecording]);

  return (
    <section className=" flex items-center justify-center py-6">
      <div className="flex gap-2 items-center">
        <motion.div
          initial="initial"
          animate="recording"
          variants={variant}
          className="w-70 pr-4 overflow-hidden bg-[#212121] items-center p-2 flex justify-between rounded-xl h-full"
        >
          <Button
            onPress={() => {
              trashRef.current = true;
              stopRecording();
            }}
            variant="light"
            isIconOnly
          >
            <XIcon className="stroke-red-500" size={18} />
          </Button>
          <p className="font-medium text-lg">{secondsToTime(seconds)}</p>
        </motion.div>
        <Button
          onPress={async () => {
            await tap();
            if (!isRecording) {
              // If no chat ID, create chat first
              if (!chatId) {
                return createChatMutation.mutate();
              }
              // Otherwise, start recording directly
              return record();
            }
            setIsRecording(false);
            stopRecording();
          }}
          isLoading={isPending || createChatMutation.isPending}
          color="primary"
          size="lg"
          isIconOnly
        >
          {isRecording ? <SendHorizonalIcon /> : <MicIcon />}
        </Button>
      </div>
    </section>
  );
}
