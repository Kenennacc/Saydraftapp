import { Spinner } from "@heroui/spinner";

export default function PageSpinner() {
  return (
    <section className="w-full h-full flex items-center justify-center">
      <Spinner size="lg" />
    </section>
  );
}
