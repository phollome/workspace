import { Db, ObjectId } from "mongodb";
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
  _id: Scalars["ID"];
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
        _id: insertedId,
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

      const { value } = await collection.findOneAndDelete({
        _id: new ObjectId(args._id),
      });

      if (value !== null) {
        removed = true;
      }

      const totalAfter = removed ? totalBefore - 1 : totalBefore;

      return {
        removed,
        totalBefore,
        totalAfter: totalAfter,
        storesItem: value,
      };
    },
  },
};

export default resolvers;
