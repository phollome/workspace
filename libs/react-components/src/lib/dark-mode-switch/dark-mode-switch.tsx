import React from "react";
import classnames from "classnames";
import { useDarkMode } from "@phollome/react-hooks";

export const Id = "dark-mode-switch";

export function DarkModeSwitch() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const darkIconClassNames = classnames(
    "block mx-1 select-none",
    isDarkMode ? "" : "hidden"
  );
  const lightIconClassNames = classnames(
    "block select-none",
    isDarkMode ? "hidden" : ""
  );

  return (
    <label className="flex flex-row items-center space-x-1 w-14 cursor-pointer bg-gray-200 focus-within:bg-blue-200 dark:bg-gray-700 dark:focus-within:bg-blue-900 border-2 rounded-full border-gray-300 dark:border-gray-800">
      <span role="img" aria-label="sun face" className={darkIconClassNames}>
        🌜
      </span>
      <span className="rounded-full w-5 h-5 ml-1 bg-white dark:bg-gray-200 border border-gray-300 dark:border-gray-600">
        <input
          id={Id}
          data-testid={Id}
          type="checkbox"
          className="w-0 h-0"
          onChange={toggleDarkMode}
          checked={isDarkMode}
          aria-checked={isDarkMode}
        />
      </span>
      <span role="img" aria-label="sun face" className={lightIconClassNames}>
        🌞
      </span>
    </label>
  );
}

export default DarkModeSwitch;
