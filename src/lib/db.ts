import { Db, MongoClient } from "mongodb"

export function getMongodb(): Db {
  try {
    const client = new MongoClient(process.env.DATABASE_URL ?? "");
    client.connect()

    const db = client.db()

    return db
  } catch {
    throw new Error("Error occurred while connecting to mongodb")
  }
}

const db: Db = getMongodb()

export default db;
