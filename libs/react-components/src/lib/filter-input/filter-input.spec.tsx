import React from "react";
import { render, screen } from "@testing-library/react";
import user from "@testing-library/user-event";

import FilterInput, { Id } from "./filter-input";

test("focus on click", () => {
  const filterValue = "filter";

  const TestChild = (props) => {
    return <p data-testid="test-child">{props.filterValue}</p>;
  };

  render(
    <FilterInput>
      <TestChild />
    </FilterInput>
  );

  const filterInput = screen.getByTestId(Id) as HTMLInputElement;
  const testChild = screen.getByTestId("test-child");

  expect(testChild.textContent).toBe("");

  user.type(filterInput, filterValue);

  expect(testChild.textContent).toBe(filterValue);
});

test("custom placeholder (inputProps example)", () => {
  const placeholder = "placeholder";

  render(<FilterInput inputProps={{ placeholder }} />);

  const filterInput = screen.getByTestId(Id) as HTMLInputElement;

  expect(filterInput.placeholder).toBe(placeholder);
});

// TODO: test focus on shortcut
