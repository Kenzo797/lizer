import connectDatabase from "../config/database.js";
import { ObjectId } from "mongodb";
import { formatObjectId } from "../traits/formatTrait.js";

let linkCollection;

async function getCollection() 
{
    if(!linkCollection) 
    {
        const db = await connectDatabase();
        linkCollection = db.collection("links");
    }
    return linkCollection;    
}

export async function addLink(linkData) 
{
    try 
    {
        const collection = await getCollection();

        const result = await collection.insertOne(linkData);
        // console.log("Link adicionado com sucesso!!!: ", result.insertedId);
        
        return result;
       
    }
    catch(error) 
    {
        console.error("Falha ao adicionar o link: ", error);
    }
}

export async function updateLink(linkId, linkData) 
{
    try 
    {
        const collection = await getCollection();

        const result = await collection.findOneAndUpdate(
            formatObjectId(linkId),
            {
                $set: {
                    ...linkData,
                    modified: true,
                    updatedAt: new Date().toLocaleString()
                }
            },
            { returnDocument: "after"}
        );
        
        // console.log(`✅ Link ${linkId} modificado! resultado: `, result);

        return result;
       
    }
    catch(error) 
    {
        console.error("Falha ao modificar o link: ", error);
    }
}

export async function deleteLink(linkId) 
{
    try
    {
        const collection = await getCollection();

        const result = await collection.findOneAndDelete(
            formatObjectId(linkId)
        );

        if(!result)
        {
            console.log("Link não encontrado !!!");
        }
        else
        {
            console.log("Link deletado com sucesso!!!, resultado: ", result);
        }
        
        return result;
    }
    catch(error)
    {
        console.error("Falha ao excluir o link: ", error);
    }
}

export async function getAllLinks() 
{
    try
    {
        const collection = await getCollection();

        const links = await collection.find({}).toArray();

        return links;
    }    
    catch(error)
    {
        console.error("Falha na aquisição dos links salvos: ", error);
    }
}

export async function getLinkById(linkId) 
{
    try
    {
        const collection = await getCollection();

        const query = formatObjectId(linkId); 
        
        // const query = typeof linkId === 'string' ? 
        // { _id: new ObjectId(linkId)} :
        // { _id : linkId};
        // console.log(query);

        const link = await collection.findOne(query);

        return link;
    }    
    catch(error)
    {
        console.error("Falha na aquisição do link: ", error);
    }
}