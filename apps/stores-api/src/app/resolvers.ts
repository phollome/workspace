import { Db, ObjectId } from "mongodb";
import {
  AddStoresItemInput,
  RemoveStoresItemPayload,
  Scalars,
  StoresItem,
  UpdateStoresItemInput,
  UpdateStoresItemPayload,
} from "./schema";
export interface Context {
  database: Db;
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

      const items = await collection.find().toArray();
      return items;
    },
  },
  Mutation: {
    addStoresItem: async (
      _,
      args: { input: AddStoresItemInput },
      context: Context
    ): Promise<StoresItem> => {
      const { input } = args;
      const { database } = context;

      const collection = await database.collection("stores-items");

      const { insertedId } = await collection.insertOne(input);

      const item = {
        _id: insertedId,
        ...input,
      };
      return item;
    },
    updateStoresItem: async (
      _,
      args: { _id: Scalars["ID"]; input: UpdateStoresItemInput },
      context: Context
    ): Promise<UpdateStoresItemPayload> => {
      const { _id, input } = args;
      const { database } = context;

      const collection = await database.collection("stores-items");

      const { value, ok } = await collection.findOneAndUpdate(
        { _id: new ObjectId(_id) },
        { $set: input }
      );

      if (ok === 1 && value !== null) {
        return {
          updated: true,
          storesItem: { ...value, ...input },
        };
      }

      return { updated: false };
    },
    removeStoresItem: async (
      _,
      args: { _id: Scalars["ID"] },
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
