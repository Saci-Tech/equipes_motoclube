// =========================================================================
// ROTA / CONTROLLER: Gestão de Eventos
// ARQUIVO: src/routes/eventos.routes.js
// =========================================================================

const express = require('express');
const router = express.Router();
const db = require('../config/database');

/**
 * @route   GET /api/eventos
 * @desc    Lista todos os eventos cadastrados
 */
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT 
                id, 
                nome, 
                DATE_FORMAT(data_evento, '%d/%m/%Y') AS data_evento, 
                tipo, 
                descricao, 
                IF(ativo, 'SIM', 'NÃO') AS ativo 
             FROM eventos 
             ORDER BY data_evento DESC`
        );

        return res.status(200).json({
            sucesso: true,
            total: rows.length,
            dados: rows
        });
    } catch (error) {
        console.error('Erro ao listar eventos:', error);
        return res.status(500).json({
            sucesso: false,
            mensagem: 'Erro interno ao consultar eventos.',
            erro: error.message
        });
    }
});

/**
 * @route   POST /api/eventos
 * @desc    Cadastra um novo evento
 */
router.post('/', async (req, res) => {
    try {
        const { nome, data_evento, tipo = 'REUNIÃO', descricao, ativo = true } = req.body;

        if (!nome || !data_evento) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Campos "nome" e "data_evento" são obrigatórios.'
            });
        }

        const [result] = await db.query(
            `INSERT INTO eventos (nome, data_evento, tipo, descricao, ativo) VALUES (?, ?, ?, ?, ?)`,
            [nome, data_evento, tipo, descricao || null, ativo]
        );

        return res.status(201).json({
            sucesso: true,
            mensagem: 'Evento cadastrado com sucesso!',
            id_evento: result.insertId
        });
    } catch (error) {
        console.error('Erro ao cadastrar evento:', error);
        return res.status(500).json({
            sucesso: false,
            mensagem: 'Erro interno ao cadastrar evento.',
            erro: error.message
        });
    }
});

module.exports = router;