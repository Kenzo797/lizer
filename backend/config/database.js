import { MongoClient } from "mongodb";
import { config } from 'dotenv';

config();

const connectionString = process.env.MONGODB_URI
const client = new MongoClient(connectionString);

let db;

export async function connectDatabase() 
{
    // console.log("Conectando a base de dados...");
    if(db)
    {
        return db;
    }    

    try 
    {
        await client.connect();
        // console.log("Conexão estabelecida ccom sucesso!!!");
        db = client.db("lizer-db");

        return db;

    }
    catch(error)
    {
        console.error("Falha ao conectar ao banco: ", error);
        process.exit(1);
    }
}

export default connectDatabase;


