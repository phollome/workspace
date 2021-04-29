import { v4 as uuid } from "uuid";
import { RemoveStoresItemPayload, Scalars, StoresItem, Unit } from "./schema";

export interface AddStoresItemInput {
  name: string;
  amount?: number;
  unit: Unit;
}

export interface RemoveStoresItemProps {
  id: Scalars["ID"];
}

let storesItems: StoresItem[] = [];

const resolvers = {
  Query: {
    totalStoresItems: () => storesItems.length,
    allStoresItems: () => storesItems,
  },
  Mutation: {
    addStoresItem: (
      parent,
      props: { input: AddStoresItemInput }
    ): StoresItem => {
      const { name, amount = 0, unit } = props.input;
      const id = uuid();
      const item = {
        id,
        name,
        amount,
        unit,
      };
      storesItems = [...storesItems, item];
      return item;
    },
    removeStoresItem: (
      parent,
      props: RemoveStoresItemProps
    ): RemoveStoresItemPayload => {
      const totalBefore = storesItems.length;
      let removed = false;

      const storesItem = storesItems.find((item) => item.id === props.id);
      if (storesItem !== undefined) {
        storesItems = storesItems.filter((item) => item.id !== props.id);
        removed = true;
      }
      const totalAfter = storesItems.length;
      return {
        removed,
        totalBefore,
        totalAfter,
        storesItem,
      };
    },
  },
};

export default resolvers;
