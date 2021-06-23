import data from "../assets/data.json";
import type { Reference } from "./schema";

export function getData() {
  return data;
}

export function getReferences(): Reference[] {
  const references = data.episodes
    .reduce((prev, cur) => {
      return prev.concat(cur.references);
    }, [])
    .map((item, index) => {
      return { _id: index, ...item };
    });
  return references;
}
