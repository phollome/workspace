import React from "react";
import { action } from "@storybook/addon-actions";

import FilterInput from "./filter-input";

export default {
  component: FilterInput,
  title: "Components/FilterInput",
  argTypes: {
    inputProps: {
      control: { disable: true },
    },
  },
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
primary.parameters = { controls: { hideNoControlsWarning: true } };

export const inputProps = (args) => {
  return <FilterInput {...args} />;
};
inputProps.args = {
  inputProps: {
    placeholder: "Overridden change handler",
    onChange: action("handle change"),
  },
};
