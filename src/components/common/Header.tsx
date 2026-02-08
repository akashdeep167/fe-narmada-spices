import { Button } from "../ui/button";
import Logo from "../../assets/logo.png";
import useTheme from "../../hooks/useTheme";
import { Moon, Sun } from "lucide-react";
import { useTranslation } from "react-i18next";
const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "hi" : "en";
    i18n.changeLanguage(newLang);
    localStorage.setItem("lng", newLang);
  };
  return (
    <div className="h-14 p-4 flex items-center justify-between font-extrabold bg-[#E8DCC8] dark:bg-[#3A3126]">
      <div>
        <img className="h-8" src={Logo} alt="Narmada Spices" />
      </div>
      <h1 className="text-2xl">Inventory Register</h1>
      <div className="flex gap-4">
        <Button variant="outline" onClick={toggleLanguage}>
          {i18n.language === "en" ? "हिंदी" : "English"}
        </Button>
        <Button
          variant="outline"
          onClick={() => toggleTheme(theme === "light" ? "dark" : "light")}
        >
          {theme === "light" ? <Moon /> : <Sun />}
        </Button>
      </div>
    </div>
  );
};

export default Header;
