"use client";
import { Sun, Moon } from "@gravity-ui/icons";
import { Switch, useTheme } from "@heroui/react";

const ThemingToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <Switch
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Power"
    >
      {({ isSelected }) => (
        <Switch.Content>
          <Switch.Control
            className={`h-[31px] w-[51px] bg-blue-500 ${isSelected ? "bg-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.5)]" : ""}`}
          >
            <Switch.Thumb
              className={`size-[27px] bg-white shadow-sm ${isSelected ? "ms-[22px] shadow-lg" : ""}`}
            >
              <Switch.Icon>
                {isSelected ? (
                  <Sun className="size-4 text-cyan-600" />
                ) : (
                  <Moon className="size-4 text-blue-600" />
                )}
              </Switch.Icon>
            </Switch.Thumb>
          </Switch.Control>
        </Switch.Content>
      )}
    </Switch>
  );
};

export default ThemingToggle;
