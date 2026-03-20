"use client";

import { cn } from "@/shared/lib/utils";
import { LogOut, PanelLeftClose, PanelLeftOpen, User } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/features/auth/hooks/use-auth";

type SidebarProps = {
  className?: string;
};

const Sidebar = ({ className }: SidebarProps) => {
  const [collapse, setCollapse] = useState(true);

  const { handleLogout } = useAuth();

  return (
    <div
      className={cn("flex flex-col", className)}
      role="complementary"
      aria-label="Sidebar"
    >
      <nav>
        <button
          aria-expanded={!collapse}
          aria-label="Toggle Button"
          onClick={() => setCollapse(!collapse)}
        >
          {!collapse && <PanelLeftClose />}
          {collapse && <PanelLeftOpen />}
        </button>
        {!collapse && <span>Boilerplate</span>}
      </nav>
      <footer>
        <a href="/profile" aria-label="Profil">
          <User />
          {!collapse && <p>Profil</p>}
        </a>
        <button aria-label="Déconnexion" onClick={handleLogout}>
          <LogOut />
          {!collapse && <p>Déconnexion</p>}
        </button>
      </footer>
    </div>
  );
};

export default Sidebar;
