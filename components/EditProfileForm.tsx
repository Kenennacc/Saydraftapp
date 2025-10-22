"use client";

import { formatApiError } from "@/misc/errors";
import { useUserInContext } from "@/providers/User";
import queryClient from "@/queryClient";
import { updateProfile, type UpdateProfile } from "@/services/auth";
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
import { EditIcon } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
  isOpen: boolean;
  onOpenChange: () => void;
};

export default function EditProfileForm({ isOpen, onOpenChange }: Props) {
  const user = useUserInContext();
  const [firstname, setFirstname] = useState(user.firstname);
  const [lastname, setLastname] = useState(user.lastname);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setFirstname(user.firstname);
    setLastname(user.lastname);
  }, [user.firstname, user.lastname]);

  const { mutate, isPending } = useMutation({
    mutationFn(payload: UpdateProfile) {
      return updateProfile(payload);
    },
    async onSuccess(data) {
      // Update the user in the query cache
      await queryClient.invalidateQueries({ queryKey: ["auth/user"] });
      
      addToast({
        description: "Profile updated successfully",
        color: "success",
      });
      onOpenChange();
      setErrors({});
    },
    onError(err) {
      const message = formatApiError(err as Error);
      addToast({
        description: message,
        color: "danger",
      });
    },
  });

  const validateName = (name: string, field: string): string | null => {
    if (!name || name.trim().length === 0) {
      return `${field} is required`;
    }
    if (name.length < 2) {
      return `${field} must be at least 2 characters`;
    }
    if (name.length > 50) {
      return `${field} must be less than 50 characters`;
    }
    if (!/^[\p{L}'\-\s]+$/u.test(name)) {
      return `${field} contains invalid characters`;
    }
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    const firstnameError = validateName(firstname, "First name");
    if (firstnameError) {
      newErrors.firstname = firstnameError;
    }

    const lastnameError = validateName(lastname, "Last name");
    if (lastnameError) {
      newErrors.lastname = lastnameError;
    }

    // Check if anything changed
    if (firstname === user.firstname && lastname === user.lastname) {
      addToast({
        description: "No changes to save",
        color: "warning",
      });
      return;
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const payload: UpdateProfile = {};
      
      if (firstname !== user.firstname) {
        payload.firstname = firstname.trim();
      }
      
      if (lastname !== user.lastname) {
        payload.lastname = lastname.trim();
      }

      mutate(payload);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <form onSubmit={handleSubmit}>
            <ModalHeader className="flex items-center gap-2">
              <EditIcon size={20} />
              Edit Profile
            </ModalHeader>
            <ModalBody>
              <Input
                autoFocus
                label="First Name"
                placeholder="Enter your first name"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                isInvalid={!!errors.firstname}
                errorMessage={errors.firstname}
              />
              <Input
                label="Last Name"
                placeholder="Enter your last name"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                isInvalid={!!errors.lastname}
                errorMessage={errors.lastname}
              />
              <div className="bg-default-100 rounded-lg p-3">
                <p className="text-sm text-default-500">
                  <span className="font-semibold">Email:</span> {user.email}
                </p>
                <p className="text-xs text-default-400 mt-1">
                  Email cannot be changed
                </p>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button color="primary" type="submit" isLoading={isPending}>
                Save Changes
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
}

