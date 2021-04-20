import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { loadSchema } from "@graphql-tools/load";
import { addResolversToSchema } from "@graphql-tools/schema";
import { ApolloServer } from "apollo-server";
import { v4 as uuid } from "uuid";
import { RemoveStoresItemPayload, StoresItem } from "./app/schema";

let storesItems: StoresItem[] = [];

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

async function main() {
  try {
    const schema = await loadSchema("./apps/stores-api/src/app/schema.gql", {
      loaders: [new GraphQLFileLoader()],
    });

    const schemaWithResolvers = addResolversToSchema({ schema, resolvers });

    const server = new ApolloServer({
      schema: schemaWithResolvers,
    });

    const serverInfo = await server.listen();
    console.log(`Server running. Check out ${serverInfo.url}`);
  } catch (err) {
    console.error(err);
  }
}

main();
