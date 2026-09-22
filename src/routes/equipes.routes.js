// =========================================================================
// ROTA / CONTROLLER: Gestão de Equipes Especiais
// ARQUIVO: src/routes/equipes.routes.js
// =========================================================================

const express = require('express');
const router = express.Router();
const pool = require('../config/database');

/**
 * @route   GET /api/equipes/ativas
 * @desc    Lista todas as equipes ativas (inclusive as vazias) com seus integrantes
 */
router.get('/ativas', async (req, res) => {
    try {
        // 1. Consulta todas as equipes ativas cadastradas em equipes_especiais
        const [equipesCadastradas] = await pool.query(
            `SELECT * FROM equipes_especiais WHERE ativo = TRUE`
        );

        // 2. Inicializa o mapa garantindo que equipes com 0 integrantes estejam presentes
        const equipesMap = {};
        equipesCadastradas.forEach(eq => {
            const idEquipe = eq.id_equipe || eq.id;
            const nomeEquipe = eq.nome_equipe || eq.nome;

            if (nomeEquipe) {
                equipesMap[nomeEquipe] = {
                    id_equipe: idEquipe,
                    nome_equipe: nomeEquipe,
                    categoria: eq.categoria,
                    descricao: eq.descricao,
                    total_integrantes: 0,
                    integrantes: []
                };
            }
        });

        // 3. Consulta a View com os integrantes vinculados
        const [rowsView] = await pool.query('SELECT * FROM vw_resumo_equipe_ativa');

        // 4. Agrupa os integrantes na respectiva equipe
        rowsView.forEach(row => {
            const nomeEquipe = row['EQUIPE'];

            if (nomeEquipe && equipesMap[nomeEquipe]) {
                if (row['ID INTEGRANTE']) {
                    equipesMap[nomeEquipe].integrantes.push({
                        id_integrante: row['ID INTEGRANTE'],
                        nome_colete: row['NOME'],
                        categoria: row['TIPO'],
                        posicao: row['POSIÇÃO']
                    });
                    equipesMap[nomeEquipe].total_integrantes += 1;
                }
            }
        });

        const dadosAgrupados = Object.values(equipesMap);

        return res.status(200).json({
            sucesso: true,
            total_equipes: dadosAgrupados.length,
            dados: dadosAgrupados
        });

    } catch (erro) {
        console.error('Erro ao consultar equipes ativas:', erro);
        return res.status(500).json({ 
            sucesso: false, 
            mensagem: 'Erro interno no servidor ao buscar equipes.',
            detalhe: erro.message 
        });
    }
});

/**
 * @route   POST /api/equipes
 * @desc    Cadastra uma nova equipe na tabela 'equipes_especiais'
 */
router.post('/', async (req, res) => {
    try {
        const { nome, nome_equipe, categoria, descricao, ativo = true } = req.body;
        const nomeFinal = nome_equipe || nome;

        if (!nomeFinal || !categoria) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Os campos de nome da equipe e "categoria" são obrigatórios.'
            });
        }

        const [result] = await pool.query(
            `INSERT INTO equipes_especiais (nome_equipe, categoria, descricao, ativo) 
             VALUES (?, ?, ?, ?)`,
            [nomeFinal, categoria, descricao || null, ativo]
        );

        return res.status(201).json({
            sucesso: true,
            mensagem: 'Equipe especial cadastrada com sucesso!',
            id_equipe: result.insertId
        });
    } catch (erro) {
        console.error('Erro ao cadastrar equipe especial:', erro);
        return res.status(500).json({
            sucesso: false,
            mensagem: 'Erro interno ao cadastrar equipe.',
            detalhe: erro.message
        });
    }
});

module.exports = router;