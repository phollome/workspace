import resolvers, { AddStoresItemInput } from "./resolvers";
import { RemoveStoresItemPayload, Unit } from "./schema";

test("get number of stores items", async () => {
  const result = await resolvers.Query.totalStoresItems();
  expect(result).toBe(0);
});

test("get all stores items", async () => {
  const result = await resolvers.Query.allStoresItems();
  expect(result.length).toBe(0);
});

test("add and remove stores item", async () => {
  const input: AddStoresItemInput = {
    name: "test",
    amount: 100,
    unit: Unit.Grams,
  };

  const item = await resolvers.Mutation.addStoresItem(null, {
    input: {
      ...input,
    },
  });

  expect(await resolvers.Query.totalStoresItems()).toBe(1);

  expect(item).toMatchObject(input);

  const payload: RemoveStoresItemPayload = await resolvers.Mutation.removeStoresItem(
    null,
    { id: item.id }
  );

  expect(payload).toMatchObject(<RemoveStoresItemPayload>{
    removed: true,
    totalBefore: 1,
    totalAfter: 0,
    storesItem: { ...item },
  });

  expect(await resolvers.Query.totalStoresItems()).toBe(0);
});
