import React from "react";
import Fuse from "fuse.js";
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
        let link;
        if (column.key === "episodeTitle") {
          link = props.reference.episodeLink;
        }
        if (column.key === "title") {
          link = props.reference.href;
        }
        return (
          <td key={`${props.rowIndex}-${i}`} className="p-2">
            {link !== undefined ? (
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="underline focus:outline-none hover:text-blue-800 focus:text-blue-800 dark:hover:text-blue-400 dark:focus:text-blue-400 inline-block"
              >
                {props.reference[column.key]}
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

const columns = [
  {
    key: "author",
    content: "Autor:innen",
  },
  { key: "title", content: "Titel" },
  { key: "publisher", content: "Verlage/Quellen" },
  { key: "episodeTitle", content: "Episodentitel" },
] as Column[];

export interface TableProps {
  filterValue: string;
  references?: EnhancedReference[];
}

export function Table(props: TableProps) {
  const { references, filterValue } = props;
  const [selectedColumn, setSelectedColumn] = React.useState<string>();
  const [sorting, setSorting] = React.useState<Sorting>();
  const [filteredReferences, setFilteredReferences] = React.useState<
    EnhancedReference[]
  >([]);
  const [sortedReferences, setSortedReferences] = React.useState<
    EnhancedReference[]
  >([]);
  const fuse = React.useRef(null);

  React.useEffect(() => {
    if (references.length > 0) {
      fuse.current = new Fuse(references, {
        keys: columns.map((column) => column.key),
        minMatchCharLength: 2,
      });
    }
  }, [references]);

  React.useEffect(() => {
    if (
      filterValue.length > 2 &&
      fuse.current !== null &&
      references.length > 0
    ) {
      const result = fuse.current.search(filterValue);
      const items = result.map((element) => element.item);
      setFilteredReferences([...items]);
    } else if (filteredReferences.length !== references.length) {
      setFilteredReferences([...references]);
    }
  }, [filterValue, references]); // eslint-disable-line

  React.useEffect(() => {
    if (sorting === Sorting.Default) {
      setSortedReferences([...filteredReferences]);
    } else {
      const sortedItems = [...filteredReferences].sort((a, b) => {
        const aContent = a[selectedColumn];
        const bContent = b[selectedColumn];
        switch (sorting) {
          case Sorting.Descending:
            return aContent.localeCompare(bContent);
          case Sorting.Ascending:
            return bContent.localeCompare(aContent);
          default:
            return 0;
        }
      });
      setSortedReferences(sortedItems);
    }
  }, [sorting, filteredReferences, selectedColumn]);

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
        {sortedReferences.map((reference, index) => {
          return (
            <TableRow
              key={`${index}`}
              rowIndex={index}
              reference={reference}
              columns={columns}
            />
          );
        })}
      </tbody>
    </table>
  );
}

Table.defaultProps = {
  filterValue: "",
  references: [],
};

export default Table;
