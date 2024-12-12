import { LoginForm } from "@/components/LoginForm";
import { Card } from "flowbite-react";

export default function Page() {
  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-2xl  flex-none">
        <LoginForm />
      </Card>
    </div>
  );
}
