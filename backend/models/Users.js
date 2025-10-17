import connectDatabase from "../config/database.js";
import { formatObjectId } from "../traits/formatTrait.js";

let UserCollection;

async function getCollection() 
{
    if(!UserCollection) 
    {
        const db = await connectDatabase();
        UserCollection = db.collection("Users");
    }
    return UserCollection;    
}

export async function createUser(UserData) 
{
    try 
    {
        const collection = await getCollection();

        const result = await collection.insertOne(UserData);
        
        return result;
       
    }
    catch(error) 
    {
        console.error("Falha ao adicionar o User: ", error);
    }
}

export async function updateUser(UserId, UserData) 
{
    try 
    {
        const collection = await getCollection();

        const result = await collection.findOneAndUpdate(
            formatObjectId(UserId),
            {
                $set: {
                    ...UserData,
                    updatedAt: new Date().toLocaleString()
                }
            },
            { returnDocument: "after"}
        );
        
        return result;
       
    }
    catch(error) 
    {
        console.error("Falha ao modificar o User: ", error);
    }
}

export async function deleteUser(UserId) 
{
    try
    {
        const collection = await getCollection();

        const result = await collection.findOneAndDelete(
            formatObjectId(UserId)
        );

        if(!result)
        {
            console.log("User não encontrado !!!");
        }
        else
        {
            console.log("User deletado com sucesso!!!, resultado: ", result);
        }
        
        return result;
    }
    catch(error)
    {
        console.error("Falha ao excluir o User: ", error);
    }
}

export async function getAllUsers() 
{
    try
    {
        const collection = await getCollection();

        const Users = await collection.find({}).toArray();

        return Users;
    }    
    catch(error)
    {
        console.error("Falha na aquisição dos Users salvos: ", error);
    }
}

export async function getUserById(UserId) 
{
    try
    {
        const collection = await getCollection();

        const query = formatObjectId(UserId); 
        
        const User = await collection.findOne(query);

        return User;
    }    
    catch(error)
    {
        console.error("Falha na aquisição do User: ", error);
    }
}