import React from "react";

enum Sorting {
  Ascending,
  Descending,
  Default = undefined,
}

function nextSorting(sorting: Sorting): Sorting {
  switch (sorting) {
    case Sorting.Descending:
      return Sorting.Ascending;
    case Sorting.Ascending:
      return Sorting.Default;
    case Sorting.Default:
      return Sorting.Descending;
  }
}

interface ColumnHeadProps {
  key: string;
  selected: boolean;
  content: string;
  sorting: Sorting;
  onClick: React.MouseEventHandler;
}

function ColumnHead(props: ColumnHeadProps) {
  const { selected, sorting, content } = props;
  const [buttonContent, setButtonContent] = React.useState<string>();

  React.useEffect(() => {
    if (selected) {
      if (sorting === Sorting.Ascending) {
        setButtonContent(`${content} ⬇`);
      } else if (sorting === Sorting.Descending) {
        setButtonContent(`${content} ⬆`);
      } else {
        setButtonContent(content);
      }
    } else {
      setButtonContent(content);
    }
  }, [selected, sorting, content]);

  return (
    <th className="w-1/4 p-1" onClick={props.onClick}>
      <button
        type="button"
        className="cursor-pointer font-bold focus:outline-none hover:text-blue-800 focus:text-blue-800 dark:hover:text-blue-400 dark:focus:text-blue-400"
      >
        {buttonContent}
      </button>
    </th>
  );
}

export interface TableProps {
  filterValue: string;
}

export function Table(props: TableProps) {
  const [selectedColumn, setSelectedColumn] = React.useState<string>();
  const [sorting, setSorting] = React.useState<Sorting>();

  const columns = [
    {
      key: "author",
      content: "Autor:innen",
    },
    { key: "title", content: "Titel" },
    { key: "publisher", content: "Verlage/Quelle" },
    { key: "episodeTitle", content: "Episodetitel" },
  ];

  const handleColumnHeadClick = (event) => {
    const { key } = columns.find(
      (column) =>
        (event.target as HTMLButtonElement).textContent.includes(column.content) // includes `${column.content} ⬆`/`${column.content} ⬇`
    );
    if (key !== selectedColumn) {
      setSelectedColumn(key);
      setSorting(Sorting.Descending);
    } else {
      setSorting(nextSorting(sorting));
    }
  };

  return (
    <table className="w-full my-2 p-2 border-2 dark:border-gray-600">
      <thead>
        <tr className="border dark:border-gray-600">
          {columns.map((column) => {
            return (
              <ColumnHead
                key={column.key}
                content={column.content}
                selected={column.key === selectedColumn}
                sorting={sorting}
                onClick={handleColumnHeadClick}
              />
            );
          })}
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{props.filterValue}</td>
        </tr>
      </tbody>
    </table>
  );
}

export default Table;
