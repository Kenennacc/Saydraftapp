import { Input, InputProps } from "@heroui/input";

export default function FormInput(props: InputProps) {
  return (
    <Input
      classNames={{
        inputWrapper: ["border-white/7"],
      }}
      size="lg"
      variant="bordered"
      {...props}
    />
  );
}
