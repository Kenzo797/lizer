import * as record from "./RecordOps.js";
import * as linkModel from "./Link.js";
const COLLECTION = "categories";

export async function onSave(categoryData) 
{
    try 
    {

        if (!categoryData.name || categoryData.name.trim() === '') 
        {
            throw new Error('Nome da categoria é obrigatório');
        }

        if(categoryData.description && categoryData.description.length > 60)
        {
            throw new Error("Descrição deve ter no máximo 60 caracteres");
        }

        if(categoryData.name && categoryData.name.length > 20)
        {
            throw new Error("Nome deve ter no máximo 20 caracteres");
        }

        const cleanName = categoryData.name.trim();

        const existing = await getManyByQuery({
            userId: categoryData.userId,
            name: categoryData.name
        });

        if(existing && existing.length > 0)
        {
            throw new Error('Esse nome de categoria já existe');
        }

        const cleanCategoryData = {
            ...categoryData,
            name: cleanName
        };

        return await record.onSave(COLLECTION, cleanCategoryData);
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
        const newName = categoryData.name?.trim() || '';

        if(newName === '')
        {
            throw new Error('Nome da categoria não pode ficar vazio');
        }

        const existing =await getManyByQuery({
            userId: categoryData.userId,
            name: newName
        });

        const duplicate = existing?.find(cat => cat._id.toString() !== categoryId);

        if(duplicate)
        {
            throw new Error(`Já existe uma categoria com o nome "${newName}"`);
        }

        if(categoryData.description && categoryData.description.length > 60)
        {
            throw new Error("Descrição deve ter no máximo 60 caracteres");
        }

        if(categoryData.name && categoryData.name.length > 20)
        {
            throw new Error("Nome deve ter no máximo 20 caracteres");
        }

        const data = {
            name: newName,
            description: categoryData.description?.trim() || ''
        };

        return await record.onEdit(COLLECTION, categoryId, data);
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

        const associedLinks = await linkModel.getManyByQuery({ categoryId: categoryId});

        if(associedLinks && associedLinks.length > 0)
        {
            for(const link  of associedLinks)
            {
                await linkModel.onEdit(link._id, { categoryId: null });
            }
        }

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