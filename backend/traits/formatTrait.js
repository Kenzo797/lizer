import { ObjectId } from "mongodb";


export function formatObjectId(id) 
{

    const query = typeof id === 'string' ? 
        { _id: new ObjectId(id)} :
        { _id : id};

    return query;
}