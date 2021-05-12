import { Collection, Db, MongoClient } from "mongodb";

let client: MongoClient;
let database: Db;

export async function connect(): Promise<void> {
  client = new MongoClient(process.env.MONGODB_URL, {
    useUnifiedTopology: true,
  });
  await client.connect();
  database = client.db(process.env.MONGODB_DATABASE);
  console.log(
    `mongodb client connected (url: ${process.env.MONGODB_URL}, database: ${process.env.MONGODB_DATABASE})`
  );
}

export async function getDatabase(): Promise<Db> {
  try {
    if (client === undefined) {
      await connect();
    }
    return database;
  } catch (err) {
    return Promise.reject(err);
  }
}

export async function getCollection(
  collectionName: string
): Promise<Collection> {
  try {
    if (client === undefined) {
      await connect();
    }
    return database.collection(collectionName);
  } catch (err) {
    return Promise.reject(err);
  }
}

export async function disconnect(): Promise<void> {
  if (client !== undefined) {
    await client.close();
  }
}
