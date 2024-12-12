import { NextIntlClientProvider } from "next-intl";
import { Inter } from "next/font/google";
import { ThemeModeScript } from "flowbite-react";
import { notFound } from "next/navigation";
import { redirect, routing } from "@/i18n/routing";
import { AppLocale, LocaleParams } from "@/i18n/types";
import { getMessages, getTranslations } from "next-intl/server";
import { PropsWithChildren } from "react";
import { headers } from "next/headers";
import { doesSUExist } from "@/prisma/utils/permissions";

import cn from "classnames";

import "../globals.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "@/components/ToastContainer";
import { AuthProvider } from "@/contexts/AuthContext";
import { AppNavbar } from "@/components/AppNavbar";

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata({ params: { locale } }: LocaleParams) {
  const t = await getTranslations({ locale, namespace: "home" });

  return {
    title: t("title"),
  };
}

interface LocaleLayoutProps extends PropsWithChildren<LocaleParams> {}

export default async function LocaleLayout({ children, params: { locale } }: LocaleLayoutProps) {
  if (!routing.locales.includes(locale as AppLocale)) {
    notFound();
  }
  const [messages, hdrs] = await Promise.all([getMessages(), headers()]);
  const pathname = hdrs.get("x-pathname") ?? "";

  const createSuperadminRoute = "/superadmin";
  if (!pathname.includes(createSuperadminRoute)) {
    const suExists = await doesSUExist();
    if (!suExists) {
      redirect({ href: createSuperadminRoute, locale });
    }
  }

  return (
    <html lang={locale}>
      <head>
        <ThemeModeScript />
      </head>
      <body className={cn(inter.className, "dark:text-white dark:bg-gray-800")}>
        <AuthProvider>
          <NextIntlClientProvider messages={messages}>
            <AppNavbar />

            <main className="container">{children}</main>

            <ToastContainer />
          </NextIntlClientProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
