import * as record from "./RecordOps.js";

const COLLECTION = "links";

export async function onSave(linkData) 
{
    try 
    {
        if(linkData.description && linkData.description.length > 60)
        {
            throw new Error("Descrição deve ter no máximo 60 caracteres");
        }

        if(linkData.title && linkData.title.length > 50)
        {
            throw new Error("Titulo deve ter no máximo 50 caracteres");
        }

        const maxTagLength = 25;

        if(linkData.tags && Array.isArray(linkData.tags)) 
        {
            const invalidTags = linkData.tags.filter(tag => tag.length > maxTagLength);
            if (invalidTags.length > 0) {
                throw new Error(`Tags não podem ter mais que ${maxTagLength} caracteres`);
            }
        }

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

export async function getManyByQuery(query) 
{
    try
    {
        return await record.getManyByQuery(COLLECTION, query);
    }
    catch(error)
    {
        console.error("Falha na aquisição: ", error);
    } 
}
