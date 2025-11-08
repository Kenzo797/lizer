import connectDatabase from "../config/database.js";
import { formatObjectId } from "../traits/formatTrait.js";

let collections = {};

async function getCollection(collectionName) 
{
    if(!collections[collectionName]) 
    {
        const db = await connectDatabase();
        collections[collectionName] = db.collection(collectionName);
        console.log(`✅ Coleção '${collectionName}' conectada`);
    }
    return collections[collectionName];
}

export async function getAll(collectionName) 
{
    const collection = await getCollection(collectionName);
    const items = await collection.find({}).toArray();
    return items;
}

export async function getById(collectionName, id) 
{
    const collection = await getCollection(collectionName);
    const query = formatObjectId(id);
    const item = await collection.findOne(query);
    return item;
}

export async function onSave(collectionName, data) 
{
    const collection = await getCollection(collectionName);
    const itemData = {
        ...data,
        createdAt: new Date().toLocaleString()
    };
    const result = await collection.insertOne(itemData);
    return result;
}

export async function onEdit(collectionName, id, data) 
{
    const collection = await getCollection(collectionName);
    const query = formatObjectId(id);

    const result = await collection.findOneAndUpdate(query,
        {
            $set: {
                ...data,
                updatedAt: new Date().toLocaleString()
            }
        },
        { returnDocument: "after"}
    );

    return result;
}

export async function onDelete(collectionName, id) 
{
    const collection = await getCollection(collectionName);
    const result = await collection.findOneAndDelete(formatObjectId(id));
    return result;
}

export async function stash(collectionName, id, data) 
{
    const collection = await getCollection(collectionName);
    const query = formatObjectId(id);

    const result = await collection.findOneAndUpdate(query,
        {
            $set: {
                ...data,
                deleted: true,
                deletedAt: new Date().toLocaleString()
            }
        },
        { returnDocument: "after"}
    );

    return result;
}