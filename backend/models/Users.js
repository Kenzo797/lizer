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

        if (data.email) {
            const existingUser = await getByQuery({ email: data.email });
            if (existingUser) {
                throw new Error('Email já cadastrado');
            }
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
        throw error;
    }
}

export async function onEdit(userId, userData) 
{
    try 
    {
        const data = {};
        
        if (userData.name !== undefined) 
        {
            data.name = userData.name;
        }
        
        if (userData.email !== undefined) 
        {
            const existingUser = await getByQuery({ email: userData.email});

            if(existingUser && existingUser._id.toString() !== userId)
            {
                throw new Error('Email já cadastrado');
            }

            data.email = userData.email;
        }
        
        if (userData.password && userData.password.trim() !== '') 
        {
            const hashedPassword = await bcrypt.hash(userData.password, 8);
            data.password = hashedPassword;
        }
        
        return await record.onEdit(COLLECTION, userId, data);
    }
    catch(error) 
    {
        console.error("Falha ao editar usuário: ", error);
        throw error;
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
        throw error;
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

export async function getByQuery(query) 
{
    try
    {
        return await record.getByQuery(COLLECTION, query);
    }
    catch(error)
    {
        console.error("Falha na aquisição do usuário: ", error);
    }
}