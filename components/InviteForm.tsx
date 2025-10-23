"use client";
import { formatApiError } from "@/misc/errors";
import queryClient from "@/queryClient";
import { sendInvite } from "@/services/chat";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal";
import { addToast } from "@heroui/toast";
import { useMutation } from "@tanstack/react-query";
import { MailIcon } from "lucide-react";
import { useState } from "react";

type Props = {
  chatId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function InviteForm({ chatId, isOpen, onOpenChange }: Props) {
  const [email, setEmail] = useState("");

  const { mutate, isPending } = useMutation({
    mutationFn(email: string) {
      return sendInvite(chatId, email);
    },
    async onSuccess() {
      addToast({
        description: "Invitation sent successfully!",
        color: "success",
      });
      setEmail("");
      onOpenChange(false);
      await queryClient.invalidateQueries({
        queryKey: ["chats"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["chats", chatId],
      });
      await queryClient.invalidateQueries({
        queryKey: ["messages", chatId],
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      addToast({
        description: "Please enter a valid email address",
        color: "warning",
      });
      return;
    }
    mutate(email);
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="center"
      backdrop="blur"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <h2 className="text-xl font-bold">Invite for Contract Review</h2>
              <p className="text-sm text-foreground/70 font-normal">
                Send an invitation to review and sign the contract
              </p>
            </ModalHeader>
            <form onSubmit={handleSubmit}>
              <ModalBody>
                <Input
                  type="email"
                  label="Email Address"
                  placeholder="johndoe@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  startContent={
                    <MailIcon className="text-default-400" size={18} />
                  }
                  labelPlacement="outside"
                  size="lg"
                  disabled={isPending}
                  required
                  autoFocus
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  variant="light"
                  onPress={onClose}
                  disabled={isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  color="primary"
                  isLoading={isPending}
                  isDisabled={!email.trim()}
                >
                  Send Invitation
                </Button>
              </ModalFooter>
            </form>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

