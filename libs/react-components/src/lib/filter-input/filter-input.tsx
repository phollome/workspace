import React from "react";

export interface FilterInputProps {
  children: React.ReactNode;
  placeholder?: string;
}

export const Id = "filter-input";

function FilterInput(props: FilterInputProps) {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [value, setValue] = React.useState<string>();

  React.useEffect(() => {
    window.addEventListener("keydown", (evt) => {
      if ((evt.metaKey || evt.ctrlKey) && evt.key === "k") {
        if (inputRef.current !== null) {
          inputRef.current.focus();
        }
      }
    });
  }, []);

  const onChange = (evt) => {
    setValue(evt.target.value);
  };
  React.isValidElement(props.children);
  const elements = React.isValidElement(props.children)
    ? React.Children.toArray(props.children).map((child) =>
        React.cloneElement(child as React.ReactElement, {
          filterValue: value,
        })
      )
    : [];

  return (
    <>
      <label htmlFor={Id}>
        <input
          id={Id}
          data-testid={Id}
          ref={inputRef}
          className="w-full p-2 border-2 rounded focus:border-gray-400 focus:outline-none"
          onChange={onChange}
          placeholder={props.placeholder}
          aria-placeholder="Press Command K or Control K to filter"
          autoComplete="off"
        />
      </label>
      {elements}
    </>
  );
}

FilterInput.defaultProps = {
  children: [],
  placeholder: "Press ⌘K or ^K",
};

export default FilterInput;
