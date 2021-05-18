import React from "react";
import { DarkModeSwitch, FilterInput } from "@phollome/react-components";
import { useDarkMode } from "@phollome/react-hooks";

export function App() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <div className="min-w-min min-h-screen bg-white dark:bg-gray-900">
      <div className="m-auto min-w-min max-w-7xl text-gray-900 dark:text-gray-300">
        <header className="p-4 text-center">
          <div className="text-right">
            <DarkModeSwitch isDarkMode={isDarkMode} onChange={toggleDarkMode} />
          </div>
          <h1 className="text-4xl font-bold">Stores</h1>
        </header>
        <main className="m-2">
          <FilterInput
            inputProps={{
              placeholder: "🔎  Drücke ⌘ + K oder ^ + K",
              "aria-label": "Drücke Command + K oder Steuerung + K zum filtern",
            }}
          ></FilterInput>
        </main>
      </div>
    </div>
  );
}

export default App;
