import React from "react";
import { render, screen } from "@testing-library/react";
import user from "@testing-library/user-event";

import DarkModeSwitch, { Id } from "./dark-mode-switch";

test('toggle "dark" class', () => {
  render(<DarkModeSwitch />);

  const darkModeSwitch = screen.getByTestId(Id);

  expect(document.body.classList).not.toContain("dark");

  user.click(darkModeSwitch);

  expect(document.body.classList).toContain("dark");
});
