import React from "react";
import { render, screen } from "@testing-library/react";
import user from "@testing-library/user-event";
import { useDarkMode } from "@phollome/react-hooks";

import DarkModeSwitch, { Id } from "./dark-mode-switch";

test("switch dark mode using hook", () => {
  const Wrapper = () => {
    const { isDarkMode, toggleDarkMode } = useDarkMode();
    return <DarkModeSwitch isDarkMode={isDarkMode} onChange={toggleDarkMode} />;
  };

  render(<Wrapper />);

  const darkModeSwitch = screen.getByTestId(Id);

  expect(document.body.classList).not.toContain("dark");

  user.click(darkModeSwitch);

  expect(document.body.classList).toContain("dark");
});

test("switch dark mode using props", () => {
  const Wrapper = () => {
    const [isDarkMode, setIsDarkMode] = React.useState(false);
    const handleChange = () => {
      setIsDarkMode(!isDarkMode);
    };
    return (
      <div data-testid="test-container" className={isDarkMode ? "dark" : ""}>
        <DarkModeSwitch isDarkMode={isDarkMode} onChange={handleChange} />
      </div>
    );
  };

  render(<Wrapper />);

  const darkModeSwitch = screen.getByTestId(Id);
  const testContainer = screen.getByTestId("test-container");

  expect(testContainer.classList).not.toContain("dark");

  user.click(darkModeSwitch);

  expect(testContainer.classList).toContain("dark");
});
