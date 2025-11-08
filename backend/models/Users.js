import * as record from "./RecordOps.js";
import bcrypt from "bcrypt";

const COLLECTION = "users";

export async function onSave(data) 
{
    try 
    {
        if (!data.password) {
            throw new Error('Senha é obrigatória');
        }

        const hashedPassword = await bcrypt.hash(data.password, 8);

        const userData = {
            ... data,
            password: hashedPassword
        }

        const result = await record.onSave(COLLECTION, userData);

        return result;

    }
    catch(error) 
    {
        console.error("Falha ao adicionar usuário: ", error);
    }
}

export async function onEdit(userId, userData) 
{
    try 
    {
        return await record.onEdit(COLLECTION, userId, userData);
    }
    catch(error) 
    {
        console.error("Falha ao editar usuário: ", error);
    }
}

export async function onDelete(userId) 
{
    try
    {
        return await record.onDelete(COLLECTION, userId);
    }
    catch(error)
    {
        console.error("Falha ao excluir usuário: ", error);
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
        console.error("Falha na aquisição dos usuários salvos: ", error);
    }
}

export async function getById(userId) 
{
    try
    {
        return await record.getById(COLLECTION, userId);
    }    
    catch(error)
    {
        console.error("Falha na aquisição do usuário: ", error);
    }
}