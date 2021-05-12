import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { loadSchema } from "@graphql-tools/load";
import { addResolversToSchema } from "@graphql-tools/schema";
import { ApolloServer } from "apollo-server";
import { connect } from "./app/provider";
import resolvers from "./app/resolvers";

async function main() {
  try {
    const database = await connect();

    const schema = await loadSchema("./apps/stores-api/src/app/schema.gql", {
      loaders: [new GraphQLFileLoader()],
    });

    const schemaWithResolvers = addResolversToSchema({ schema, resolvers });

    const server = new ApolloServer({
      schema: schemaWithResolvers,
      context: { database },
    });

    const serverInfo = await server.listen({ port: process.env.PORT || 4200 });
    console.log(`Server running. Check out ${serverInfo.url}`);
  } catch (err) {
    console.error(err);
  }
}

main();
