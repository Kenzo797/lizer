import express from 'express';

export function createRoutes(model, routeName) 
{

    console.log(`🔧 Criando rotas para: ${routeName}`);
    // console.log(`🔧 Model functions:`, Object.keys(model));

    const router = express.Router();

    // GET /api/{routeName} - Listar todos
    router.get('/', async (req, res) => {
        try 
        {
            const objects = await model.getAll();
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
            const result = await model.onSave(req.body);
            res.status(201).json({
                success: true,
                message: `${routeName} salvo com sucesso !!!`,
                data: {
                    id: result.insertedId,
                    ...req.body
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