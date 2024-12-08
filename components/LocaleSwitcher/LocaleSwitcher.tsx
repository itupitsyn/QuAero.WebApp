"use client";

import { usePathname, useRouter } from "@/i18n/routing";
import { Dropdown, DropdownItem } from "flowbite-react";
import { useLocale } from "next-intl";
import { useParams } from "next/navigation";

export const LocaleSwitcher = () => {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();

  return (
    <Dropdown label={locale} dismissOnClick={false} gradientDuoTone="redToYellow" outline>
      {["en", "ru", "ch"].map((item) => (
        <DropdownItem
          key={item}
          onClick={() => {
            router.replace(
              // @ts-expect-error -- TypeScript will validate that only known `params`
              // are used in combination with a given `pathname`. Since the two will
              // always match for the current route, we can skip runtime checks.
              { pathname, params },
              { locale: item },
            );
          }}
        >
          {item}
        </DropdownItem>
      ))}
    </Dropdown>
  );
};
