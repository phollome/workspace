import React from "react";
import Toggle from "react-toggle";
import "react-toggle/style.css";
import "./dark-mode-switch.css";

export const Label = "dark mode switch";

export interface DarkModeSwitch {
  isDarkMode: boolean;
  onChange: React.ChangeEventHandler;
}

export function DarkModeSwitch(props: DarkModeSwitch) {
  const { isDarkMode, onChange } = props;

  return (
    <label htmlFor={Label}>
      <Toggle
        id={Label}
        className="toggle"
        aria-label={Label}
        checked={isDarkMode}
        onChange={onChange}
        icons={{
          checked: (
            <span
              role="img"
              aria-label="moon face"
              className="flex justify-center items-center w-2.5 h-2.5"
            >
              🌜
            </span>
          ),
          unchecked: (
            <span
              role="img"
              aria-label="sun face"
              className="flex justify-center items-center w-2.5 h-2.5"
            >
              🌞
            </span>
          ),
        }}
      />
    </label>
  );
}

export default DarkModeSwitch;
