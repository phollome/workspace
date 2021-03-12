import React from "react";
import FilterInput from "./filter-input";

export default {
  component: FilterInput,
  title: "Components/FilterInput",
  argTypes: {
    placeholder: { control: "text" },
  },
  args: {
    placeholder: undefined,
  },
};

export const primary = (args) => {
  const TestChild = (props) => {
    return (
      <p className="mt-2 text-xs font-mono">filterValue: {props.filterValue}</p>
    );
  };
  return (
    <FilterInput {...args}>
      <TestChild />
    </FilterInput>
  );
};
