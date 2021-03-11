import React from "react";
import { render, screen } from "@testing-library/react";
import user from "@testing-library/user-event";

import FilterInput, { Id } from "./filter-input";

test("focus on click", () => {
  const filterString = "filter";
  const onChange = jest.fn();

  render(<FilterInput onChange={onChange} />);

  const element = screen.queryByTestId(Id) as HTMLInputElement;
  user.type(element, filterString);

  expect(element.value).toBe(filterString);
  expect(onChange).toHaveBeenCalledTimes(filterString.length);
});

// TODO: test focus on shortcut
