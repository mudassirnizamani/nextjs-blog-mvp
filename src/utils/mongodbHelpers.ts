import db from "@/lib/db"
import { WithId, Document, Filter } from "mongodb"

export function findMany<T>(collectionName: string, condition: Filter<Document>): Promise<WithId<T>[]> {
  return db.collection(collectionName).find(condition).toArray() as Promise<WithId<T>[]>;
}

export function count(collectionName: string, condition: Filter<Document>): Promise<number> {
  return db.collection(collectionName).countDocuments(condition)
}

export async function findOne<T>(collectionName: string, condition: any): Promise<WithId<T> | null> {
  const doc = await db.collection(collectionName).findOne(condition);
  return doc as WithId<T> | null;
}


export function updateOne(collectionName: string, filter: Filter<Document>, update: any) {
  return db.collection(collectionName).updateOne(filter, { "$set": update })
}

export function deleteOne(collection: string, filter: Filter<Document>) {
  return db.collection(collection).deleteOne(filter)
}
