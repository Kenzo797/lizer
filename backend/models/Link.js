import * as record from "./RecordOps.js";

const COLLECTION = "links";

export async function onSave(linkData) 
{
    try 
    {
        return await record.onSave(COLLECTION, linkData);
    }
    catch(error) 
    {
        console.error("Falha ao adicionar o link: ", error);
    }
}

export async function onEdit(linkId, linkData) 
{
    try 
    {
        return await record.onEdit(COLLECTION, linkId, linkData);
    }
    catch(error) 
    {
        console.error("Falha ao modificar o link: ", error);
    }
}

export async function onDelete(linkId) 
{
    try
    {
        return await record.onDelete(COLLECTION, linkId);
    }
    catch(error)
    {
        console.error("Falha ao excluir o link: ", error);
    }
}

export async function getAll() 
{
    try
    {
       return await record.getAll(COLLECTION);
    }    
    catch(error)
    {
        console.error("Falha na aquisição dos links salvos: ", error);
    }
}

export async function getById(linkId) 
{
    try
    {
        return await record.getById(COLLECTION, linkId);
    }    
    catch(error)
    {
        console.error("Falha na aquisição do link: ", error);
    }
}