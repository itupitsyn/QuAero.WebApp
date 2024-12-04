import { NextIntlClientProvider } from "next-intl";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeModeScript } from "flowbite-react";
import "../globals.css";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { AppLocale, LocaleParams } from "@/i18n/types";
import { getMessages, getTranslations } from "next-intl/server";
import { PropsWithChildren } from "react";
import cn from "classnames";

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata({ params: { locale } }: LocaleParams) {
  const t = await getTranslations({ locale, namespace: "home" });

  return {
    title: t("title"),
  };
}

interface RootLayoutProps extends PropsWithChildren<LocaleParams> {}

export default async function RootLayout({ children, params: { locale } }: RootLayoutProps) {
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as AppLocale)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <ThemeModeScript />
      </head>
      <body className={cn(inter.className, "dark:text-white dark:bg-gray-800")}>
        <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
