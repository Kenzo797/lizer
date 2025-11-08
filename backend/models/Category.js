import * as record from "./RecordOps.js";

const COLLECTION = "categories";

export async function onSave(categoryData) 
{
    try 
    {
        return await record.onSave(COLLECTION, categoryData);
    }
    catch(error) 
    {
        console.error("Falha ao adicionar categoria: ", error);
    }
}

export async function onEdit(categoryId, categoryData) 
{
    try 
    {
        return await record.onEdit(COLLECTION, categoryId, categoryData);
    }
    catch(error) 
    {
        console.error("Falha ao editar categoria: ", error);
    }
}

export async function onDelete(categoryId) 
{
    try
    {
        return await record.onDelete(COLLECTION, categoryId);
    }
    catch(error)
    {
        console.error("Falha ao excluir categoria: ", error);
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
        console.error("Falha na busca das categorias salvas: ", error);
    }
}

export async function getById(categoryId) 
{
    try
    {
        return await record.getById(COLLECTION, categoryId);
    }    
    catch(error)
    {
        console.error("Falha na busca por categoria: ", error);
    }
}