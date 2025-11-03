import express from 'express';
import { getAllLinks, getLinkById, addLink, updateLink, deleteLink, } from '../models/Link.js';

const router = express.Router(); 
//instancia um objeto rota


// GET /api/links - Buscar todos os links
router.get('/', async (req, res) => {
    try 
    {
        const links = await getAllLinks();
        res.json({
            success: true,
            count: links.length,
            data: links
        });
    }
    catch(error)
    {
        res.status(500).json({
            success: false,
            error: 'Falha ao buscar links: ' + error.message
        });
    }
});

// GET /api/links/:id - Buscar link por ID
router.get('/:id', async (req, res) => {
    try 
    {
        const link = await getLinkById(req.params.id);
        if(!link)
        {
            return res.status(404).json({
                success: false,
                error: 'Link não encontrado'
            });
        }

        res.json({
            success: true,
            data: link
        });
    }
    catch(error)
    {
        res.status(500).json({
            success: false,
            error: 'Falha ao buscar link: ' + error.message
        });
    }
});

// POST /api/links - Criar novo link
router.post('/', async (req, res) => {
    try
    {
        const result = await addLink(req.body);
        res.status(201).json({
            success: true,
            message: 'Link criado com sucesso !',
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
            message: 'Falha ao criar link: ' + error.message
        });
    }
});

// PUT /api/links/:id - Atualizar link
router.put('/:id', async (req, res) => {
    
    try
    {
        const result = await updateLink(req.params.id, req.body);
        res.json({
            success: true,
            message: 'Link atualizado com sucesso!',
            data: result
        });
    }
    catch(error)
    {
        res.status(400).json({
            success: false,
            message: 'Falha ao atualizar link: ' + error.message
        });
    }
});

// DELETE /api/links/:id - Deletar link
router.delete('/:id', async (req, res) => {
    try
    {
        const result = await deleteLink(req.params.id);
        res.json({
            success: true,
            message: 'Link deletado com sucesso!',
            data: result
        });
    }
    catch(error)
    {
        res.status(400).json({
            success: false,
            message: 'Falha ao deletar o link: ' + error.message
        });
    }
});

export default router;
