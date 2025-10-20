import { formatApiError } from "@/misc/errors";
import { useUserInContext } from "@/providers/User";
import queryClient from "@/queryClient";
import { logout } from "@/services/auth";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownProps,
  DropdownSection,
  DropdownTrigger,
} from "@heroui/dropdown";
import { addToast } from "@heroui/toast";
import { User } from "@heroui/user";
import { useMutation } from "@tanstack/react-query";
import { CreditCardIcon, EditIcon, KeyIcon, LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

export default function Profile({
  trigger,
  ...props
}: Omit<DropdownProps, "children" | "trigger"> & {
  trigger: ReactNode;
}) {
  const user = useUserInContext();
  const router = useRouter();
  const { mutate: logoutMutate } = useMutation({
    mutationFn() {
      return logout();
    },
    async onSuccess() {
      await queryClient.setQueryData(["auth/user"], null);
      router.replace("/auth/login");
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
    <Dropdown {...props}>
      <DropdownTrigger>{trigger}</DropdownTrigger>

      <DropdownMenu>
        <DropdownSection showDivider>
          <DropdownItem key="user-info">
            <User
              avatarProps={{
                name: `${user.firstname[0]}${user.lastname[0]}`,
                classNames: {
                  base: "bg-linear-to-br from-[#5940ff] to-[#FF705B]",
                },
              }}
              className="capitalize"
              name={`${user.firstname} ${user.lastname}`}
            />
          </DropdownItem>
          <DropdownItem
            startContent={<EditIcon size={18} />}
            key="edit-profile"
          >
            Edit Profile
          </DropdownItem>
          <DropdownItem
            startContent={<KeyIcon size={18} />}
            key="change-password"
          >
            Change Password
          </DropdownItem>
          {!user.isAdmin ? (
            <DropdownItem
              startContent={<CreditCardIcon size={18} />}
              key="subscription"
              onPress={() => router.push("/subscription")}
            >
              Subscription
            </DropdownItem>
          ) : null}
        </DropdownSection>
        <DropdownSection>
          <DropdownItem
            onPress={async () => {
              logoutMutate();
            }}
            className="text-danger"
            startContent={<LogOutIcon className="stroke-danger" size={18} />}
            key="edit-profile"
          >
            Logout
          </DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
}
