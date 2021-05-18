import React from "react";
import { render } from "@testing-library/react";

import App from "./app";
it("render successfully", () => {
  const { baseElement } = render(<App />);
  expect(baseElement).toBeTruthy();
});
