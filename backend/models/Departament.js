import connectDatabase from "../config/database.js";
import { formatObjectId } from "../traits/formatTrait.js";

let DepartamentCollection;

async function getCollection() 
{
    if(!DepartamentCollection) 
    {
        const db = await connectDatabase();
        DepartamentCollection = db.collection("Departament");
    }
    return DepartamentCollection;    
}

export async function createDepartament(DepartamentData) 
{
    try 
    {
        const collection = await getCollection();

        const result = await collection.insertOne(DepartamentData);
        
        return result;
       
    }
    catch(error) 
    {
        console.error("Falha ao adicionar o Departament: ", error);
    }
}

export async function updateDepartament(DepartamentId, DepartamentData) 
{
    try 
    {
        const collection = await getCollection();

        const result = await collection.findOneAndUpdate(
            formatObjectId(DepartamentId),
            {
                $set: {
                    ...DepartamentData,
                    updatedAt: new Date().toLocaleString()
                }
            },
            { returnDocument: "after"}
        );
        
        return result;
       
    }
    catch(error) 
    {
        console.error("Falha ao modificar o Departament: ", error);
    }
}

export async function deleteDepartament(DepartamentId) 
{
    try
    {
        const collection = await getCollection();

        const result = await collection.findOneAndDelete(
            formatObjectId(DepartamentId)
        );

        if(!result)
        {
            console.log("Departament não encontrado !!!");
        }
        else
        {
            console.log("Departament deletado com sucesso!!!, resultado: ", result);
        }
        
        return result;
    }
    catch(error)
    {
        console.error("Falha ao excluir o Departament: ", error);
    }
}

export async function getAllDepartament() 
{
    try
    {
        const collection = await getCollection();

        const Departament = await collection.find({}).toArray();

        return Departament;
    }    
    catch(error)
    {
        console.error("Falha na aquisição dos Departament salvos: ", error);
    }
}

export async function getDepartamentById(DepartamentId) 
{
    try
    {
        const collection = await getCollection();

        const query = formatObjectId(DepartamentId); 
        
        const Departament = await collection.findOne(query);

        return Departament;
    }    
    catch(error)
    {
        console.error("Falha na aquisição do Departament: ", error);
    }
}