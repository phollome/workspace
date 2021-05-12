import { Db } from "mongodb";
import { v4 as uuid } from "uuid";
import { RemoveStoresItemPayload, Scalars, StoresItem, Unit } from "./schema";

export interface Context {
  database: Db;
}

export interface AddStoresItemInput {
  name: string;
  amount?: number;
  unit: Unit;
}

export interface RemoveStoresItemProps {
  id: Scalars["ID"];
}

const resolvers = {
  Query: {
    totalStoresItems: async (_, args, context: Context) => {
      const { database } = context;

      const collection = await database.collection("stores-items");

      const total = await collection.countDocuments();
      return total;
    },
    allStoresItems: async (
      _,
      args,
      context: Context
    ): Promise<StoresItem[]> => {
      const { database } = context;

      const collection = await database.collection("stores-items");

      const items = collection
        .find()
        .map((item) => {
          const { _id: id, ...otherProps } = item;
          return { id, ...otherProps };
        })
        .toArray();
      return items;
    },
  },
  Mutation: {
    addStoresItem: async (
      _,
      args: { input: AddStoresItemInput },
      context: Context
    ): Promise<StoresItem> => {
      const { name, amount = 0, unit } = args.input;
      const { database } = context;

      const collection = await database.collection("stores-items");

      const { insertedId } = await collection.insertOne({ name, amount, unit });

      const item = {
        id: insertedId,
        name,
        amount,
        unit,
      };
      return item;
    },
    removeStoresItem: async (
      _,
      args: RemoveStoresItemProps,
      context: Context
    ): Promise<RemoveStoresItemPayload> => {
      const { database } = context;
      const collection = await database.collection("stores-items");

      const totalBefore = await collection.countDocuments();
      let removed = false;

      const { value } = await collection.findOneAndDelete({ _id: args.id });

      if (value !== null) {
        removed = true;
      }

      return {
        removed,
        totalBefore,
        totalAfter: totalBefore - 1,
        storesItem: value,
      };
    },
  },
};

export default resolvers;
