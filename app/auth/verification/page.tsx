import Verify from "@/components/Verify";
import UserProvider from "@/providers/User";

export default function Verification() {
  return (
    <UserProvider>
      <section className="flex w-full min-h-screen items-start justify-center">
        <Verify />
      </section>
    </UserProvider>
  );
}
