import { ObjectID } from "mongodb";
import resolvers from "./resolvers";
import {
  AddStoresItemInput,
  RemoveStoresItemPayload,
  Unit,
  UpdateStoresItemInput,
  UpdateStoresItemPayload,
} from "./schema";

// TODO: replace "any" from database mocks

test("get number of stores items", async () => {
  let storesItems = [];

  const countDocumentsMock = jest.fn(async () => storesItems.length);
  const insertOneMock = jest.fn(async (doc) => {
    const { name, unit } = doc;
    const _id = new ObjectID().toString();
    const item = {
      _id,
      name,
      unit,
    };
    storesItems = [...storesItems, item];
    return { insertedId: _id };
  });

  const databaseMock: any = {
    collection: async () => {
      return {
        countDocuments: countDocumentsMock,
        insertOne: insertOneMock,
      };
    },
  };

  expect(
    await resolvers.Query.totalStoresItems({}, {}, { database: databaseMock })
  ).toBe(0);

  await resolvers.Mutation.addStoresItem(
    {},
    { input: { name: "Test", unit: Unit.Piece } },
    { database: databaseMock }
  );

  expect(
    await resolvers.Query.totalStoresItems({}, {}, { database: databaseMock })
  ).toBe(1);

  // check if mock used correctly
  expect(insertOneMock).toHaveBeenCalledTimes(1);
  expect(countDocumentsMock).toHaveBeenCalledTimes(2);
});

test("get all stores items", async () => {
  let storesItems = [];

  const findMock = jest.fn(() => {
    return { toArray: async () => storesItems };
  });
  const insertOneMock = jest.fn(async (doc) => {
    const { name, unit } = doc;
    const _id = new ObjectID().toString();
    const item = {
      _id,
      name,
      unit,
    };
    storesItems = [...storesItems, item];
    return { insertedId: _id };
  });

  const databaseMock: any = {
    collection: async () => ({
      find: findMock,
      insertOne: insertOneMock,
    }),
  };

  expect(
    (await resolvers.Query.allStoresItems({}, {}, { database: databaseMock }))
      .length
  ).toBe(0);

  await resolvers.Mutation.addStoresItem(
    {},
    { input: { name: "Test", unit: Unit.Piece } },
    { database: databaseMock }
  );

  expect(
    (await resolvers.Query.allStoresItems({}, {}, { database: databaseMock }))
      .length
  ).toBe(1);

  // check if mock used correctly
  expect(insertOneMock).toHaveBeenCalledTimes(1);
  expect(findMock).toHaveBeenCalledTimes(2);
});

test("add, update and remove stores item", async () => {
  let storesItems = [];

  const countDocumentsMock = jest.fn(async () => {
    return storesItems.length;
  });
  const insertOneMock = jest.fn(async (doc) => {
    const { name, amount = 0, unit } = doc;
    const _id = new ObjectID().toString();
    const item = {
      _id,
      name,
      amount,
      unit,
    };
    storesItems = [...storesItems, item];
    return { insertedId: _id };
  });
  const findOneAndUpdateMock = jest.fn(async (query, update) => {
    const parsedId = query._id.toString();
    const { $set } = update;

    const index = storesItems.findIndex((item) => item._id === parsedId);
    const value = { ...storesItems[index] };
    storesItems[index] = { ...value, ...$set };

    return { ok: 1, value };
  });
  const findOneAndDeleteMock = jest.fn(async (query) => {
    const parsedId = query._id.toString();

    const storesItem = storesItems.find((item) => item._id === parsedId);
    storesItems = storesItems.filter((item) => item._id !== parsedId);

    return { value: storesItem };
  });

  const databaseMock: any = {
    collection: async () => ({
      countDocuments: countDocumentsMock,
      insertOne: insertOneMock,
      findOneAndUpdate: findOneAndUpdateMock,
      findOneAndDelete: findOneAndDeleteMock,
    }),
  };

  const input: AddStoresItemInput = {
    name: "test",
    amount: 100,
    unit: Unit.Grams,
  };

  const update: UpdateStoresItemInput = {
    name: "test2",
    amount: 102,
  };

  const item = await resolvers.Mutation.addStoresItem(
    {},
    {
      input: {
        ...input,
      },
    },
    { database: databaseMock }
  );

  expect(
    await resolvers.Query.totalStoresItems({}, {}, { database: databaseMock })
  ).toBe(1);

  expect(item).toMatchObject(input);

  const updatePayload: UpdateStoresItemPayload = await resolvers.Mutation.updateStoresItem(
    {},
    { _id: item._id, input: update },
    { database: databaseMock }
  );

  const updatedItem = { ...item, ...update };

  expect(updatePayload).toMatchObject(<UpdateStoresItemPayload>{
    updated: true,
    storesItem: updatedItem,
  });

  const payload: RemoveStoresItemPayload = await resolvers.Mutation.removeStoresItem(
    {},
    { _id: item._id },
    { database: databaseMock }
  );

  expect(payload).toMatchObject(<RemoveStoresItemPayload>{
    removed: true,
    totalBefore: 1,
    totalAfter: 0,
    storesItem: updatedItem,
  });

  expect(
    await resolvers.Query.totalStoresItems({}, {}, { database: databaseMock })
  ).toBe(0);

  expect(insertOneMock).toHaveBeenCalledTimes(1);
  expect(findOneAndUpdateMock).toHaveBeenCalledTimes(1);
  expect(findOneAndDeleteMock).toHaveBeenCalledTimes(1);
  expect(countDocumentsMock).toHaveBeenCalledTimes(3); // two times in test, one time on remove
});
