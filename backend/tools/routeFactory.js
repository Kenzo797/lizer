import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';

export function createRoutes(model, routeName, options = {}) 
{

    const router = express.Router();
    const { protected: isProtected = false} = options;

    if(isProtected)
    {
        router.use(authMiddleware);
    }

    // GET /api/{routeName} - Listar todos
    router.get('/', async (req, res) => {
        try 
        {
            let objects;
            
            if(isProtected && req.userId)
            {
                objects = await model.getManyByQuery({ userId: req.userId});
            }
            else
            {
                objects = await model.getAll();
            }


            res.json({
                success: true,
                count: objects.length,
                data: objects
            });
        }
        catch(error)
        {
            res.status(500).json({
                success: false,
                error: `Erro ao buscar ${routeName}: ${error.message}`
            });
        }
    });

    // GET /api/{routeName} - Buscar por id
    router.get('/:id', async (req, res) => {
        try 
        {
            const object = await model.getById(req.params.id);
            if(!object)
            {
                return res.status(404).json({
                    success: false,
                    error: `${routeName} não encontrado`
                });
            }

            if(isProtected && object.userId !== req.userId)
            {
                return res.status(403).json({
                    success: false,
                    error: "Acesso negado"
                });
            }
    
            res.json({
                success: true,
                data: object
            });
        }
        catch(error)
        {
            res.status(500).json({
                success: false,
                error: `Falha ao buscar ${routeName}: ${error.message}`
            });
        }
    });

    // POST /api/{routeName} - Criar novo objeto
    router.post('/', async (req, res) => {
        try
        {

            let data = req.body;

            if(isProtected && req.userId)
            {
                data = { ...data, userId: req.userId};
            }

            const result = await model.onSave(data);
            res.status(201).json({
                success: true,
                message: `${routeName} salvo com sucesso !!!`,
                data: {
                    id: result.insertedId
                }
            });
        }
        catch (error)
        {
            res.status(400).json({
                success: false,
                error: `Falha ao salvar ${routeName}: ${error.message}`
            });
        }
    });

    // PUT /api/{routeName}/:id - Atualizar objeto
    router.put('/:id', async (req, res) => {
        
        try
        {

            if(isProtected)
            {
                const existing = await model.getById(req.params.id);
                if(!existing || existing.userId !== req.userId)
                {
                    return res.status(403).json({
                        success: false,
                        error: "Acesso negado"
                    });
                }
            }

            const result = await model.onEdit(req.params.id, req.body);
            if(result)
            {
                res.json({
                    success: true,
                    message: `${routeName} atualizado com sucesso !!!`,
                    data: result
                });
            }
            else
            {
                res.status(404).json({
                    success: false,
                    error: `${routeName} não encontrado`
                });
            }
        }
        catch(error)
        {
            res.status(400).json({
                success: false,
                error: `Falha ao atualizar ${routeName} : ${error.message}`
            });
        }
    });

    // DELETE /api/{routeName}/:id - Deletar objeto
    router.delete('/:id', async (req, res) => {
        try
        {

            if(isProtected)
            {
                const existing = await model.getById(req.params.id);
                if(!existing || existing.userId !== req.userId)
                {
                    return res.status(403).json({
                        success: false,
                        error: "Acesso negado"
                    });
                }
            }


            const result = await model.onDelete(req.params.id);
            if(result)
            {
                res.json({
                    success: true,
                    message: `${routeName} deletado com sucesso !!!`,
                    data: result
                });
            }
            else
            {
                res.status(404).json({
                    success: false,
                    error: `${routeName} não encontrado`
                });
            }
        }
        catch(error)
        {
            res.status(400).json({
                success: false,
                error: `Falha ao deletar ${routeName} : ${error.message}`
            });
        }
    });

    return router;
}