import React from "react";
import { action } from "@storybook/addon-actions";
import FilterInput, { FilterInputProps } from "./FilterInput";

export default {
  component: FilterInput,
  title: "Components/FilterInput",
};

export const primary = () => {
  const props: FilterInputProps = {
    onChange: action("onChange"),
  };

  return <FilterInput onChange={props.onChange} />;
};
