"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Link, useRouter } from "@/i18n/routing";
import { signOut } from "@/utils/api";
import { Avatar, Dropdown, Navbar } from "flowbite-react";
import { useLocale, useTranslations } from "next-intl";
import { FC, MouseEventHandler, useCallback } from "react";
import { toast } from "react-toastify";

export const UserInfo: FC = () => {
  const t = useTranslations("navbar");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const { push } = useRouter();
  const { user, status, updateAuth } = useAuth();

  const onSignOutClick: MouseEventHandler<HTMLAnchorElement> = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        await signOut();
        updateAuth();
        push("/", { locale });
      } catch {
        toast.error(tCommon("unknownErrorMessage"));
      }
    },
    [locale, push, tCommon, updateAuth],
  );

  if (status !== "ready") return null;

  return user ? (
    <>
      <Dropdown
        arrowIcon={false}
        inline
        label={
          <Navbar.Brand as="div">
            <span className="mr-2">{user.name || user.login}</span>
            <Avatar alt="User settings" img={user.image} rounded />
          </Navbar.Brand>
        }
      >
        <Dropdown.Item>
          <Link className="transition-opacity hover:opacity-60" href="/" onClick={onSignOutClick}>
            {t("signout")}
          </Link>
        </Dropdown.Item>
      </Dropdown>
    </>
  ) : (
    <Link className="transition-opacity hover:opacity-60" href="/signin">
      {t("signin")}
    </Link>
  );
};
