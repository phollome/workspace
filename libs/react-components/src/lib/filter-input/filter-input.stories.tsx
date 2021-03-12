import React from "react";
import { action } from "@storybook/addon-actions";
import FilterInput, { FilterInputProps } from "./filter-input";

export default {
  component: FilterInput,
  title: "Components/FilterInput",
};

export const primary = () => {
  const TestChild = (props) => {
    return (
      <p className="mt-2 text-xs font-mono">filterValue: {props.filterValue}</p>
    );
  };
  return (
    <FilterInput>
      <TestChild />
    </FilterInput>
  );
};
