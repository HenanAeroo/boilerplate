"use client";

import { LogOut, PanelLeftClose, PanelLeftOpen, User } from "lucide-react";
import { useState } from "react";

const Sidebar = () => {
  const [collapse, setCollapse] = useState(true);

  function handleLogout() {}

  return (
    <div className="flex flex-col" role="complementary" aria-label="Sidebar">
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
