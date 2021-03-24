import React from "react";
import { render } from "@testing-library/react";

import Table, { TableProps } from "./table";

test("render", () => {
  const { baseElement } = render(<Table {...({} as TableProps)} />);
  expect(baseElement).toBeTruthy();
});
