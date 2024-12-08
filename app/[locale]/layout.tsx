import { NextIntlClientProvider } from "next-intl";
import { Inter } from "next/font/google";
import { DarkThemeToggle, Navbar, NavbarBrand, NavbarCollapse, NavbarToggle, ThemeModeScript } from "flowbite-react";
import { notFound } from "next/navigation";
import { redirect, routing } from "@/i18n/routing";
import { AppLocale, LocaleParams } from "@/i18n/types";
import { getMessages, getTranslations } from "next-intl/server";
import { PropsWithChildren } from "react";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { headers } from "next/headers";
import { doesSUExist } from "@/prisma/utils/permissions";
import logo from "../../public/logo.jpg";

import cn from "classnames";

import "../globals.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "@/components/ToastContainer";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata({ params: { locale } }: LocaleParams) {
  const t = await getTranslations({ locale, namespace: "home" });

  return {
    title: t("title"),
  };
}

interface RootLayoutProps extends PropsWithChildren<LocaleParams> {}

export default async function RootLayout({ children, params: { locale } }: RootLayoutProps) {
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
        <NextIntlClientProvider messages={messages}>
          <Navbar className="mb-8">
            <NavbarBrand>
              <Image src={logo} alt="QuAero" width={48} height={48} className="rounded-full" />
              <span className="ml-2 font-bold">QuAero</span>
            </NavbarBrand>
            <div className="flex items-start gap-4">
              <DarkThemeToggle />
              <LocaleSwitcher />
            </div>
          </Navbar>

          <main className="container">{children}</main>

          <ToastContainer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
