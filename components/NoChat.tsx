import { getDayPeriod } from "@/misc";
import { useUserInContext } from "@/providers/User";
import { Image } from "@heroui/image";
import NextImage from "next/image";

export default function NoChat() {
  const user = useUserInContext();

  const day = getDayPeriod(user.timezone);

  return (
    <section className="w-full h-full px-2 flex-col items-center pt-32 flex">
      <Image
        src="/ai.gif"
        alt="ai"
        height={200}
        as={NextImage}
        width={200}
        className="w-90 shrink-0 h-70 object-cover"
      />
      <p className="md:text-3xl text-xl capitalize text-center font-bold">
        Good {day}, {user.firstname}
      </p>
      <p className="md:text-lg opacity-50 mt-1 text-center">
        What type of contract do you need created today?
      </p>
    </section>
  );
}
