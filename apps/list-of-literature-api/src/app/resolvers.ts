import { getReferences } from "./provider";
import { Reference } from "./schema";

const resolvers = {
  Query: {
    getReferences: async (): Promise<Reference[]> => {
      const references = getReferences();
      return references;
    },
  },
  Reference: {
    __resolveType: (obj) => {
      if (obj.href !== undefined) {
        return "Online";
      }
      return "Book";
    },
  },
};

export default resolvers;
