import React from "react";
import { EnhancedReference } from "../app";

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

interface Column {
  key: string;
  content: string;
}

interface TableRowProps {
  rowIndex: number;
  columns: Column[];
  reference: EnhancedReference;
}

function TableRow(props: TableRowProps) {
  return (
    <tr className="border odd:bg-gray-100 dark:odd:bg-gray-800 dark:border-gray-600">
      {props.columns.map((column, i) => {
        const hasLink =
          column.key === "episodeTitle" && props.reference.episodeLink;
        return (
          <td key={`${props.rowIndex}-${i}`} className="p-2">
            {hasLink ? (
              <a
                href={props.reference.episodeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="underline focus:outline-none hover:text-blue-800 focus:text-blue-800 dark:hover:text-blue-400 dark:focus:text-blue-400 inline-block"
              >
                {props.reference.episodeTitle}
              </a>
            ) : (
              props.reference[column.key]
            )}
          </td>
        );
      })}
    </tr>
  );
}

export interface TableProps {
  filterValue: string;
  references?: EnhancedReference[];
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
  ] as Column[];

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
        {props.references.map((reference, index) => {
          return (
            <TableRow
              key={`${index}`}
              rowIndex={index}
              reference={reference}
              columns={columns}
            />
          );
        })}
        <tr>
          <td>{props.filterValue}</td>
        </tr>
      </tbody>
    </table>
  );
}

Table.defaultProps = {
  references: [],
};

export default Table;
