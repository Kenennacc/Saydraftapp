import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Image } from "@heroui/image";
import clsx from "clsx";
import { ReactElement, ReactNode } from "react";

export default function BaseForm({
  children,
  title,
  description,
  hideLogo,
  footer,
}: {
  title: ReactNode;
  hideLogo?: boolean;
  description: ReactNode;
  children: ReactNode;
  footer?: ReactElement;
}) {
  return (
    <Card
      classNames={{ base: "shadow-none" }}
      className="md:w-md w-full bg-transparent md:px-4 shrink-0"
    >
      <CardHeader className="flex flex-col justify-center">
        {!hideLogo ? <Image width={100} src="/logo.png" /> : null}
        <p className={clsx("text-3xl font-bold", !hideLogo && "mt-12")}>
          {title}
        </p>
        <p className="opacity-60 text-center mt-1 mb-6">{description}</p>
      </CardHeader>
      <CardBody>{children}</CardBody>
      {footer ? (
        <CardFooter className="flex gap-1 justify-center items-center">
          {footer}
        </CardFooter>
      ) : null}
    </Card>
  );
}
