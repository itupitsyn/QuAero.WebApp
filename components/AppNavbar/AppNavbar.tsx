import { DarkThemeToggle, Navbar, NavbarBrand, NavbarCollapse, NavbarToggle } from "flowbite-react";
import { UserInfo } from "../UserInfo";
import { LocaleSwitcher } from "../LocaleSwitcher";
import Image from "next/image";
import logo from "../../public/logo.jpg";
import { Link } from "@/i18n/routing";

export const AppNavbar = () => {
  return (
    <Navbar className="mb-8" fluid rounded>
      <Link href="/" className="flex items-center gap-4">
        <Image src={logo} alt="QuAero" width={48} height={48} className="rounded-full" />
        <span className="ml-2 font-bold">QuAero</span>
      </Link>
      <div className="flex items-center gap-4">
        <UserInfo />
        <DarkThemeToggle />
        <LocaleSwitcher />
      </div>
    </Navbar>
  );
};
