"use client";

import { Bell } from "lucide-react";
import { usePathname } from "next/navigation";

const Header = () => {
  const pathName = usePathname();

  const segment = pathName.split("/").at(-1);

  const pageTitle = segment
    ? segment.charAt(0).toUpperCase() + segment.slice(1)
    : "Home";

  return (
    <div className="flex justify-between" role="banner" aria-label="Header">
      <h1 aria-label="Titre de la page">{pageTitle}</h1>
      <button aria-label="Notifications">
        <Bell />
      </button>
    </div>
  );
};

export default Header;
