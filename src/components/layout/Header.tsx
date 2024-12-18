import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ProfileMenu from "./ProfileMenu";

interface HeaderProps {
  user?: {
    name: string;
    email: string;
    avatarUrl: string;
  };
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
  onLogoutClick?: () => void;
}

const Header = ({
  user = {
    name: "John Doe",
    email: "john.doe@example.com",
    avatarUrl: "https://dummyimage.com/200/cccccc/666666&text=JD",
  },
  onProfileClick = () => {},
  onSettingsClick = () => {},
  onLogoutClick = () => {},
}: HeaderProps) => {
  return (
    <header className="w-full h-16 border-b bg-background">
      <div className="container h-full mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-semibold text-lg">Goal Coach</span>
          </Link>

          <nav className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link to="/">Dashboard</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/goals">Goals</Link>
            </Button>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <ProfileMenu
            user={user}
            onProfileClick={onProfileClick}
            onSettingsClick={onSettingsClick}
            onLogoutClick={onLogoutClick}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
