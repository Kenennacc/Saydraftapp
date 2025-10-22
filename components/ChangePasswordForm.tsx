"use client";

import { formatApiError } from "@/misc/errors";
import { changePassword, type ChangePassword } from "@/services/auth";
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
import { EyeIcon, EyeOffIcon, KeyIcon } from "lucide-react";
import { useRef, useState } from "react";

type Props = {
  isOpen: boolean;
  onOpenChange: () => void;
};

export default function ChangePasswordForm({ isOpen, onOpenChange }: Props) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const currentPasswordRef = useRef<HTMLInputElement>(null);
  const newPasswordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const handleInputFocus = (ref: React.RefObject<HTMLInputElement>) => {
    // Small delay to ensure keyboard is opening
    setTimeout(() => {
      ref.current?.scrollIntoView({ 
        behavior: "smooth", 
        block: "center",
        inline: "nearest"
      });
    }, 300);
  };

  const { mutate, isPending } = useMutation({
    mutationFn(payload: ChangePassword) {
      return changePassword(payload);
    },
    onSuccess() {
      addToast({
        description: "Password changed successfully",
        color: "success",
      });
      onOpenChange();
      // Reset form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
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

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return "Password must be at least 8 characters";
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return "Password must include a lowercase letter";
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return "Password must include an uppercase letter";
    }
    if (!/(?=.*\d)/.test(password)) {
      return "Password must include a number";
    }
    if (!/(?=.*[^\w\s])/.test(password)) {
      return "Password must include a special character";
    }
    if (/\s/.test(password)) {
      return "Password must not contain spaces";
    }
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!newPassword) {
      newErrors.newPassword = "New password is required";
    } else {
      const passwordError = validatePassword(newPassword);
      if (passwordError) {
        newErrors.newPassword = passwordError;
      }
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password";
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (currentPassword === newPassword) {
      newErrors.newPassword = "New password must be different from current password";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      mutate({ currentPassword, newPassword });
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <form onSubmit={handleSubmit}>
            <ModalHeader className="flex items-center gap-2">
              <KeyIcon size={20} />
              Change Password
            </ModalHeader>
            <ModalBody className="gap-4">
              <Input
                ref={currentPasswordRef}
                autoFocus
                label="Current Password"
                placeholder="Enter your current password"
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                onFocus={() => handleInputFocus(currentPasswordRef)}
                isInvalid={!!errors.currentPassword}
                errorMessage={errors.currentPassword}
                endContent={
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="focus:outline-none"
                  >
                    {showCurrentPassword ? (
                      <EyeOffIcon size={20} className="text-default-400" />
                    ) : (
                      <EyeIcon size={20} className="text-default-400" />
                    )}
                  </button>
                }
              />
              <Input
                ref={newPasswordRef}
                label="New Password"
                placeholder="Enter your new password"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                onFocus={() => handleInputFocus(newPasswordRef)}
                isInvalid={!!errors.newPassword}
                errorMessage={errors.newPassword}
                endContent={
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="focus:outline-none"
                  >
                    {showNewPassword ? (
                      <EyeOffIcon size={20} className="text-default-400" />
                    ) : (
                      <EyeIcon size={20} className="text-default-400" />
                    )}
                  </button>
                }
              />
              <Input
                ref={confirmPasswordRef}
                label="Confirm New Password"
                placeholder="Confirm your new password"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onFocus={() => handleInputFocus(confirmPasswordRef)}
                isInvalid={!!errors.confirmPassword}
                errorMessage={errors.confirmPassword}
                endContent={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="focus:outline-none"
                  >
                    {showConfirmPassword ? (
                      <EyeOffIcon size={20} className="text-default-400" />
                    ) : (
                      <EyeIcon size={20} className="text-default-400" />
                    )}
                  </button>
                }
              />
              <div className="text-sm text-default-500">
                <p className="font-semibold mb-1">Password requirements:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>At least 8 characters</li>
                  <li>Include uppercase and lowercase letters</li>
                  <li>Include at least one number</li>
                  <li>Include at least one special character</li>
                </ul>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button color="primary" type="submit" isLoading={isPending}>
                Change Password
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
}

