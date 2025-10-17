import { addLink, deleteLink, getAllLinks, getLinkById, updateLink } from "./models/Link.js";
import { createUser } from "./models/Users.js";


async function testarUpdateLink(linkId) 
{

  console.log("Testando atualização de link...");
  
  const result = await updateLink(linkId, {
    title: "Novo Link MODIFICADO em: " + new Date().toLocaleString(),
    tags: ["atualizado23235234243", "novo123123"],
    fodase: "sim"
  });

  // console.log("resultado da modificação: ", result);

}

async function testarAddLink() 
{
  console.log("Testando adição de um link...");
  
  const result = await addLink({
    title: "Novo Link " + new Date().toLocaleString(),
    tags: ["novo link", "novidade"],
    url: "www.teste." + new Date().toLocaleString() + ".com",
    description: "teste de adição:" + new Date().toLocaleString(),
    createdAt: new Date()
  });

  console.log("Link Adicionado com sucesso!!: ", result);

}

async function testarAddUser() 
{
  console.log("Testando adição de um usuário...");
  
  const result = await createUser({
    name: "Arthur",
    email: "Arthur@email.com",
    password: "1234",
    createdAt: new Date().toLocaleString()
  });

  console.log("Usuário Adicionado com sucesso!!: ", result);

}

async function testarDeleteLink(linkId) 
{
  console.log("Testando exclusão de link...");
  await deleteLink(linkId);
}

// testarUpdateLink("68f05e92ed5310df96102cb8").catch(console.error);
// testarDeleteLink("68e5b67bd6d0cbfd02382bdb").catch(console.error);
// testarAddLink().catch(console.error);
testarAddUser().catch(console.error);