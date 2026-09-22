// =========================================================================
// ROTA / CONTROLLER: Gestão de Equipamentos e Categorias
// ARQUIVO: src/routes/equipamentos.routes.js
// =========================================================================

const express = require('express');
const router = express.Router();
const db = require('../config/database');

/**
 * @route   GET /api/equipamentos/categorias
 * @desc    Lista todas as categorias de equipamentos
 */
router.get('/categorias', async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT id, nome FROM categoria_equipamentos ORDER BY nome ASC`
        );

        return res.status(200).json({
            sucesso: true,
            dados: rows
        });
    } catch (error) {
        console.error('Erro ao buscar categorias de equipamentos:', error);
        return res.status(500).json({
            sucesso: false,
            mensagem: 'Erro interno ao buscar categorias.',
            erro: error.message
        });
    }
});

/**
 * @route   POST /api/equipamentos/categorias
 * @desc    Cadastra uma nova categoria de equipamento
 */
router.post('/categorias', async (req, res) => {
    try {
        const { nome } = req.body;

        if (!nome) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'O campo "nome" da categoria é obrigatório.'
            });
        }

        const [result] = await db.query(
            `INSERT INTO categoria_equipamentos (nome) VALUES (?)`,
            [nome]
        );

        return res.status(201).json({
            sucesso: true,
            mensagem: 'Categoria de equipamento cadastrada com sucesso!',
            id_categoria: result.insertId
        });
    } catch (error) {
        console.error('Erro ao cadastrar categoria de equipamento:', error);
        return res.status(500).json({
            sucesso: false,
            mensagem: 'Erro interno ao cadastrar categoria.',
            erro: error.message
        });
    }
});

/**
 * @route   GET /api/equipamentos
 * @desc    Lista os equipamentos cadastrados no sistema
 */
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT 
                eq.id, 
                eq.nome, 
                ce.nome AS categoria, 
                eq.id_categoria, 
                IF(eq.ativo, 'SIM', 'NÃO') AS ativo 
             FROM equipamentos eq
             INNER JOIN categoria_equipamentos ce ON eq.id_categoria = ce.id
             WHERE eq.ativo = TRUE
             ORDER BY ce.nome ASC, eq.nome ASC`
        );

        return res.status(200).json({
            sucesso: true,
            total: rows.length,
            dados: rows
        });
    } catch (error) {
        console.error('Erro ao listar equipamentos:', error);
        return res.status(500).json({
            sucesso: false,
            mensagem: 'Erro interno ao listar equipamentos.',
            erro: error.message
        });
    }
});

/**
 * @route   POST /api/equipamentos
 * @desc    Cadastra um novo equipamento base
 */
router.post('/', async (req, res) => {
    try {
        const { id_categoria, nome, ativo = true } = req.body;

        if (!id_categoria || !nome) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Campos "id_categoria" e "nome" são obrigatórios.'
            });
        }

        const [result] = await db.query(
            `INSERT INTO equipamentos (id_categoria, nome, ativo) VALUES (?, ?, ?)`,
            [id_categoria, nome, ativo]
        );

        return res.status(201).json({
            sucesso: true,
            mensagem: 'Equipamento cadastrado com sucesso!',
            id_equipamento: result.insertId
        });
    } catch (error) {
        console.error('Erro ao cadastrar equipamento:', error);
        return res.status(500).json({
            sucesso: false,
            mensagem: 'Erro interno ao cadastrar equipamento.',
            erro: error.message
        });
    }
});

module.exports = router;