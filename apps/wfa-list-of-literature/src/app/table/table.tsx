import React from "react";

export interface TableProps {
  filterValue: string;
}

export function Table(props: TableProps) {
  return (
    <div>
      <h1>{props.filterValue}</h1>
    </div>
  );
}

export default Table;
