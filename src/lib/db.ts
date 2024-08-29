import { Db, MongoClient } from "mongodb"

export function getMongodb(): Db {
  try {
    const client = new MongoClient("mongodb+srv://mudasiralinizamani:minemine@cluster0.1j2vw.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0kk");
    client.connect()

    const db = client.db()

    return db
  } catch {
    throw new Error("Error occurred while connecting to mongodb")
  }
}

const db: Db = getMongodb()

export default db;
