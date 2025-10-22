import { useUserInContext } from "@/providers/User";
import { Image } from "@heroui/image";
import { AlertCircleIcon } from "lucide-react";
import NextImage from "next/image";

export default function NoChat() {
  const user = useUserInContext();

  return (
    <section className="w-full h-full px-2 flex-col items-center pt-32 flex">
      <Image
        src="/ai.gif"
        alt="ai"
        height={200}
        unoptimized
        as={NextImage}
        width={200}
        className="w-90 shrink-0 h-70 object-cover"
      />
      <p className="md:text-3xl text-xl capitalize text-center font-bold">
        Hello {user.firstname}
      </p>
      <p className="md:text-lg opacity-50 mt-1 text-center">
        What type of contract do you need created today?
      </p>
      <div className="mt-8 px-4 py-3 max-w-2xl">
        <div className="flex items-center justify-center gap-2">
          <AlertCircleIcon size={16} className="text-warning/70 shrink-0" />
          <p className="text-xs text-default-500 leading-relaxed text-center">
            Our AI may make errors or spelling mistakes. If you notice any, please correct or spell them out to keep your contract accurate.{" "}
            <span className="text-primary font-medium">Press the microphone below to start.</span>
          </p>
        </div>
      </div>
    </section>
  );
}
