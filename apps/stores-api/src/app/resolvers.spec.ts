import { v4 as uuid } from "uuid";
import resolvers, { AddStoresItemInput } from "./resolvers";
import { RemoveStoresItemPayload, Unit } from "./schema";

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
    const id = uuid();
    const item = {
      id,
      name,
      amount,
      unit,
    };
    storesItems = [...storesItems, item];
    return { insertedId: id };
  });
  const findOneAndDeleteMock = jest.fn(async (query) => {
    const storesItem = storesItems.find((item) => item.id === query._id);
    storesItems = storesItems.filter((item) => item.id !== query._id);
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
    { id: item.id },
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
