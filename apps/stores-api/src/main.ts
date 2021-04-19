import { ApolloServer, gql } from "apollo-server";
import { v4 as uuid } from "uuid";

enum Unit {
  NUMBER,
  GRAMS,
}

interface StoresItem {
  id: string;
  name: string;
  amount: number;
  unit: Unit;
}

interface RemoveStoresItemPayload {
  removed: boolean;
  totalBefore: number;
  totalAfter: number;
  storesItem: StoresItem;
}

let storesItems: StoresItem[] = [];

const typeDefs = gql`
  enum Unit {
    NUMBER
    GRAMS
  }

  type StoresItem {
    id: ID!
    name: String!
    amount: Int!
    unit: Unit!
  }

  type RemoveStoresItemPayload {
    removed: Boolean
    totalBefore: Int
    totalAfter: Int
    storesItem: StoresItem
  }

  type Query {
    "total number of stores items"
    totalStoresItems: Int
    "all stores items"
    allStoresItems: [StoresItem]
  }

  input StoresItemInput {
    name: String!
    amount: Int
    unit: Unit!
  }

  type Mutation {
    "add stores item"
    addStoresItem(input: StoresItemInput): StoresItem
    "remove stores item by id"
    removeStoresItem(id: ID!): RemoveStoresItemPayload
  }
`;

const resolvers = {
  Query: {
    totalStoresItems: () => storesItems.length,
    allStoresItems: () => storesItems,
  },
  Mutation: {
    addStoresItem: (parent, props): StoresItem => {
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
    removeStoresItem: (parent, props): RemoveStoresItemPayload => {
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

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

async function main() {
  try {
    const serverInfo = await server.listen();
    console.log(`Server running. Check out ${serverInfo.url}`);
  } catch (err) {
    console.error(err);
  }
}

main();
