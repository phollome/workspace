import React from "react";
import DarkModeSwitch from "./dark-mode-switch";

export default {
  component: DarkModeSwitch,
  title: "Components/DarkModeSwitch",
};

export const Primary = () => {
  const [isDarkMode, setIsDarkMode] = React.useState<boolean>(false);

  const handleChange = () => {
    setIsDarkMode(!isDarkMode);
  };

  return <DarkModeSwitch isDarkMode={isDarkMode} onChange={handleChange} />;
};
Primary.parameters = { controls: { hideNoControlsWarning: true } };
