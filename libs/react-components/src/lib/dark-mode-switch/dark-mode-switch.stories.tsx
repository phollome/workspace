import React from "react";
import DarkModeSwitch from "./dark-mode-switch";

export default {
  component: DarkModeSwitch,
  title: "Components/DarkModeSwitch",
};

export const primary = () => {
  return (
    <div className="p-4 flex justify-center dark:bg-black">
      <DarkModeSwitch />
    </div>
  );
};
primary.parameters = { controls: { hideNoControlsWarning: true } };
