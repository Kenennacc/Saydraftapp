import { removeQueryParam } from "@/misc";
import { formatApiError } from "@/misc/errors";
import queryClient from "@/queryClient";
import { Chat, deleteChat, updateChat } from "@/services/chat";
import { Button } from "@heroui/button";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@heroui/modal";
import { addToast } from "@heroui/toast";
import { useMutation } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import { EditIcon, TrashIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { ReactNode } from "react";
import * as yup from "yup";
import FormInput from "./FormInput";

type Props = {
  id: string;
  title: string;
  trigger: ReactNode;
};

const renameChat = yup.object({
  title: yup
    .string()
    .required("Title is required")
    .min(8, "Title must be at least 8 characters")
    .max(32, "Title must be at most 32 characters"),
});

export default function ChatDropdownMenu({ id, trigger, title }: Props) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const router = useRouter();

  const params = useSearchParams();

  const { mutate, isPending } = useMutation({
    mutationFn(chat: Partial<Chat>) {
      return updateChat(chat);
    },
    async onSuccess() {
      await queryClient.invalidateQueries({
        queryKey: ["chats"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["chats", id],
      });
      onClose();
    },
  });

  const { mutate: deleteChatMutate } = useMutation({
    mutationFn(id: string) {
      return deleteChat(id);
    },
    async onSuccess() {
      await queryClient.invalidateQueries({
        queryKey: ["chats"],
      });
      removeQueryParam(router, params, "id");
    },
    onError(err) {
      const message = formatApiError(err as Error);
      addToast({
        description: message,
        color: "danger",
      });
    },
  });

  return (
    <>
      <Dropdown backdrop="blur" size="sm">
        <DropdownTrigger>{trigger}</DropdownTrigger>
        <DropdownMenu>
          <DropdownItem
            onPress={onOpen}
            startContent={<EditIcon size={18} />}
            key="rename-chat"
          >
            Rename Chat
          </DropdownItem>
          <DropdownItem
            startContent={<TrashIcon size={18} className="stroke-danger" />}
            key="delete-chat"
            className="text-danger"
            onPress={() => {
              deleteChatMutate(id);
            }}
          >
            Delete Chat
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <Modal backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Rename Chat</ModalHeader>
              <ModalBody>
                <Formik
                  validateOnMount={false}
                  validateOnChange={true}
                  validationSchema={renameChat}
                  initialValues={{ title }}
                  onSubmit={(values) => {
                    mutate({
                      id,
                      title: values.title,
                    });
                  }}
                >
                  {({ errors, handleSubmit, touched, getFieldProps }) => (
                    <Form onSubmit={handleSubmit}>
                      <div className="flex flex-col w-full gap-3">
                        <FormInput
                          isRequired
                          errorMessage={errors.title}
                          isInvalid={touched.title && !!errors.title}
                          label=""
                          labelPlacement="inside"
                          placeholder={title}
                          {...getFieldProps("title")}
                        />
                      </div>
                      <div className="flex w-full mb-2 justify-end mt-6 items-center gap-1">
                        <Button variant="light" onPress={onClose}>
                          Cancel
                        </Button>
                        <Button
                          isLoading={isPending}
                          type="submit"
                          className="bg-primary"
                          variant="solid"
                        >
                          Save
                        </Button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
