import Logo from "../../assets/logo.png";
import useTheme from "../../hooks/useTheme";
import { useTranslation } from "react-i18next";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

import { Menu, Moon, Sun, Globe, LogOut, User, Settings } from "lucide-react";

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "hi" : "en";
    i18n.changeLanguage(newLang);
    localStorage.setItem("lng", newLang);
  };

  const user = {
    name: "Akash",
    role: "Admin",
    email: "akash@narmadaspices.com",
  };

  return (
    <header className="h-14 px-5 flex items-center justify-between border-b bg-[#E8DCC8] dark:bg-[#3A3126]">
      {/* LEFT */}
      <div className="flex items-center gap-3">
        <img src={Logo} className="h-8" />
        <div className="leading-tight">
          <p className="font-semibold text-sm">Narmada Spices</p>
          <p className="text-xs text-muted-foreground">Slips</p>
        </div>
      </div>

      {/* RIGHT MENU */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon">
            <Menu size={20} />
          </Button>
        </SheetTrigger>

        <SheetContent side="right" className="w-[320px] p-0">
          {/* USER PROFILE */}
          <div className="p-5 flex items-center gap-4 bg-muted/40">
            <Avatar className="h-10 w-10">
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>

            <div className="flex flex-col">
              <span className="font-medium">{user.name}</span>
              <span className="text-xs text-muted-foreground">{user.role}</span>
            </div>
          </div>

          <Separator />

          {/* SETTINGS SECTION */}
          <div className="p-4 space-y-2">
            <p className="text-xs font-medium text-muted-foreground mb-2">
              Preferences
            </p>

            <Button
              variant="ghost"
              className="w-full justify-start gap-3"
              onClick={() => toggleTheme(theme === "light" ? "dark" : "light")}
            >
              {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
              {theme === "light" ? "Dark Mode" : "Light Mode"}
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start gap-3"
              onClick={toggleLanguage}
            >
              <Globe size={16} />
              {i18n.language === "en" ? "Switch to Hindi" : "Switch to English"}
            </Button>
          </div>

          <Separator />

          {/* ACCOUNT SECTION */}
          <div className="p-4 space-y-2">
            <p className="text-xs font-medium text-muted-foreground mb-2">
              Account
            </p>

            <Button variant="ghost" className="w-full justify-start gap-3">
              <User size={16} />
              Profile
            </Button>

            <Button variant="ghost" className="w-full justify-start gap-3">
              <Settings size={16} />
              Settings
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-red-500"
            >
              <LogOut size={16} />
              Logout
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
};

export default Header;
