import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface ThemeContextType {
  darkMode: boolean;
  compactMode: boolean;
  setDarkMode: (value: boolean) => void;
  setCompactMode: (value: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [darkMode, setDarkModeState] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });

  const [compactMode, setCompactModeState] = useState(() => {
    const saved = localStorage.getItem("compactMode");
    return saved ? JSON.parse(saved) : false;
  });

  const setDarkMode = (value: boolean) => {
    setDarkModeState(value);
    localStorage.setItem("darkMode", JSON.stringify(value));
  };

  const setCompactMode = (value: boolean) => {
    setCompactModeState(value);
    localStorage.setItem("compactMode", JSON.stringify(value));
  };

  useEffect(() => {
    const root = document.documentElement;
    
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    if (compactMode) {
      root.classList.add("compact");
    } else {
      root.classList.remove("compact");
    }
  }, [darkMode, compactMode]);

  return (
    <ThemeContext.Provider value={{ darkMode, compactMode, setDarkMode, setCompactMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};