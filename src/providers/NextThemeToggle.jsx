"use client";
import { ThemeProvider } from "next-themes";

const NestThemeProvider = ({ children }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      {children}
    </ThemeProvider>
  );
};

export default NestThemeProvider;
