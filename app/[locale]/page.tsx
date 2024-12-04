import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { DarkThemeToggle } from "flowbite-react";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("home");

  return (
    <main className="flex min-h-screen items-center justify-center gap-2">
      <h1 className="text-2xl">{t("title")}</h1>
      <DarkThemeToggle />
      <LocaleSwitcher />
    </main>
  );
}
