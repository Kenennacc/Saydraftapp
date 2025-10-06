import { tap } from "@/misc";
import { Button } from "@heroui/button";
import { EllipsisVertical, Volume2Icon } from "lucide-react";

export default function MessageMenu() {
  return (
    <div className="flex gap-1 items-center">
      <Button
        onPress={async () => {
          await tap(0.4);
        }}
        size="sm"
        variant="light"
        isIconOnly
      >
        <Volume2Icon size={18} />
      </Button>
      <Button size="sm" variant="light" isIconOnly>
        <EllipsisVertical size={18} />
      </Button>
    </div>
  );
}
