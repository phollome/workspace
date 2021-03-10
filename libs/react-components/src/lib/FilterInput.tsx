import React from "react";

export interface FilterInputProps {
  onChange: React.ChangeEventHandler;
}

export const Id = "filter-input";

function FilterInput(props: FilterInputProps) {
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    window.addEventListener("keydown", (evt) => {
      if ((evt.metaKey || evt.ctrlKey) && evt.key === "k") {
        if (inputRef.current !== null) {
          inputRef.current.focus();
        }
      }
    });
  }, []);

  return (
    <label htmlFor={Id}>
      <input
        id={Id}
        data-testid={Id}
        ref={inputRef}
        className="w-full p-2 border-2 rounded focus:border-gray-400 focus:outline-none"
        onChange={props.onChange}
        placeholder="Press ⌘K or ^K to filter"
        aria-placeholder="Press Command K or Control K to filter"
        autoComplete="off"
      />
    </label>
  );
}

export default FilterInput;
