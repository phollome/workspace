import { ObjectID } from "mongodb";
import resolvers from "./resolvers";
import { AddStoresItemInput, RemoveStoresItemPayload, Unit } from "./schema";

// TODO: replace "any" from database mocks

test("get number of stores items", async () => {
  const countDocumentsMock = jest.fn(async () => 0);

  const databaseMock: any = {
    collection: async () => {
      return {
        countDocuments: countDocumentsMock,
      };
    },
  };

  const result = await resolvers.Query.totalStoresItems(
    {},
    {},
    { database: databaseMock }
  );

  expect(result).toBe(0);

  expect(countDocumentsMock).toHaveBeenCalledTimes(1);
});

test("get all stores items", async () => {
  const findMock = jest.fn(() => {
    return { map: () => ({ toArray: () => [] }) };
  });

  const databaseMock: any = {
    collection: async () => ({
      find: findMock,
    }),
  };

  const result = await resolvers.Query.allStoresItems(
    {},
    {},
    { database: databaseMock }
  );

  expect(result.length).toBe(0);

  expect(findMock).toHaveBeenCalledTimes(1);
});

test("add and remove stores item", async () => {
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
      findOneAndDelete: findOneAndDeleteMock,
    }),
  };

  const input: AddStoresItemInput = {
    name: "test",
    amount: 100,
    unit: Unit.Grams,
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

  const payload: RemoveStoresItemPayload = await resolvers.Mutation.removeStoresItem(
    {},
    { _id: item._id },
    { database: databaseMock }
  );

  expect(payload).toMatchObject(<RemoveStoresItemPayload>{
    removed: true,
    totalBefore: 1,
    totalAfter: 0,
    storesItem: { ...item },
  });

  expect(
    await resolvers.Query.totalStoresItems({}, {}, { database: databaseMock })
  ).toBe(0);

  expect(insertOneMock).toHaveBeenCalledTimes(1);
  expect(findOneAndDeleteMock).toHaveBeenCalledTimes(1);
  expect(countDocumentsMock).toHaveBeenCalledTimes(3); // two times in test, one time on remove
});
