"use client";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import Lottie from "lottie-react";
import { ReactNode } from "react";

type Props = {
  title: ReactNode;

  description: ReactNode;

  lottie: unknown;

  buttonText: string;

  isButtonLoading?: boolean;

  onButtonPress?: () => void;
};

export default function EmailLink({
  lottie,
  onButtonPress,
  buttonText,
  title,
  isButtonLoading,
  description,
}: Props) {
  return (
    <Card
      classNames={{ base: "border-none mt-24 shadow-none bg-transparent" }}
      className="md:w-lg md:shrink-0"
    >
      <CardBody className="flex w-full p-3 flex-col items-center">
        <Lottie
          className="w-50 h-50"
          animationData={lottie}
          loop={true}
          autoplay
        />
        <h1 className="font-bold text-center text-3xl mt-6">{title}</h1>
        {typeof description === "string" ? (
          <p className="mt-4 opacity-75 text-center md:max-w-lg">
            {description}
          </p>
        ) : (
          description
        )}
        <Button
          onPress={onButtonPress}
          isLoading={isButtonLoading}
          size="lg"
          className="bg-primary mt-12"
          fullWidth
        >
          {buttonText}
        </Button>
      </CardBody>
    </Card>
  );
}
