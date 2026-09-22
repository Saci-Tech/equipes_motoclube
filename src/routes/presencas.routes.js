// =========================================================================
// ROTA / CONTROLLER: Gestão de Presenças e QR Code
// ARQUIVO: src/routes/presencas.routes.js
// =========================================================================

const express = require('express');
const router = express.Router();
const { randomUUID } = require('crypto');
const QRCode = require('qrcode');
const pool = require('../config/database');

/**
 * @route   GET /api/presencas
 * @desc    Lista o histórico geral das últimas presenças confirmadas
 */
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT 
                pe.id,
                pe.id_evento,
                e.titulo AS nome_evento,
                pe.id_integrante,
                pe.nome_colete,
                pe.presente,
                pe.justificativa_falta,
                pe.justificativa_aceita,
                DATE_FORMAT(pe.data_criacao, '%d/%m/%Y %H:%i:%s') AS data_criacao
             FROM presenca_eventos pe
             INNER JOIN eventos e ON pe.id_evento = e.id
             WHERE pe.presente = 1
             ORDER BY pe.data_criacao DESC
             LIMIT 50`
        );

        return res.status(200).json({
            sucesso: true,
            total: rows.length,
            dados: rows
        });

    } catch (erro) {
        console.error('Erro ao buscar presenças:', erro);
        return res.status(500).json({
            sucesso: false,
            mensagem: 'Erro interno ao buscar histórico de presenças.',
            detalhe: erro.message
        });
    }
});

/**
 * @route   POST /api/presencas/eventos/:id/gerar-qr
 * @desc    Gera/renova a chave_qr do evento e renderiza o QR Code
 */
router.post('/eventos/:id/gerar-qr', async (req, res) => {
    try {
        const { id } = req.params;

        const [eventos] = await pool.query(
            `SELECT id, titulo, ativo FROM eventos WHERE id = ?`, 
            [id]
        );

        if (eventos.length === 0 || !eventos[0].ativo) {
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Evento não encontrado ou inativo.'
            });
        }

        const evento = eventos[0];
        const chaveQr = randomUUID();

        await pool.query(
            `UPDATE eventos SET chave_qr = ? WHERE id = ?`,
            [chaveQr, evento.id]
        );

        const payloadQr = JSON.stringify({
            id_evento: parseInt(evento.id, 10),
            chave_qr: chaveQr
        });

        const qrCodeDataUrl = await QRCode.toDataURL(payloadQr);
        const qrCodeTerminal = await QRCode.toString(payloadQr, { type: 'terminal', small: true });

        console.log(`\n=== QR CODE GERADO PARA O EVENTO [ID: ${evento.id} - ${evento.titulo}] ===`);
        console.log(qrCodeTerminal);

        return res.status(200).json({
            sucesso: true,
            mensagem: 'QR Code do evento gerado com sucesso.',
            dados: {
                id_evento: parseInt(evento.id, 10),
                titulo: evento.titulo,
                chave_qr: chaveQr,
                payload_bruto: payloadQr,
                qr_code_base64: qrCodeDataUrl
            }
        });

    } catch (erro) {
        console.error('Erro ao gerar QR Code do evento:', erro);
        return res.status(500).json({
            sucesso: false,
            mensagem: 'Erro interno ao gerar QR Code.',
            detalhe: erro.message
        });
    }
});

/**
 * @route   POST /api/presencas/validar
 * @desc    Confirma a presença na tabela 'presenca_eventos'
 */
router.post('/validar', async (req, res) => {
    try {
        const { id_evento, chave_qr, id_integrante, uuid_dispositivo } = req.body;

        if (!id_evento || !chave_qr || !id_integrante || !uuid_dispositivo) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Dados incompletos. Requer: id_evento, chave_qr, id_integrante e uuid_dispositivo.'
            });
        }

        // 1. Valida o integrante e seu dispositivo
        const [integrantes] = await pool.query(
            `SELECT id, nome_colete, ativo, uuid_dispositivo 
             FROM integrantes 
             WHERE id = ?`,
            [id_integrante]
        );

        if (integrantes.length === 0 || !integrantes[0].ativo) {
            return res.status(403).json({
                sucesso: false,
                mensagem: 'Integrante não encontrado ou inativo.'
            });
        }

        const integrante = integrantes[0];

        if (integrante.uuid_dispositivo !== uuid_dispositivo) {
            return res.status(401).json({
                sucesso: false,
                mensagem: 'Dispositivo não autorizado para este integrante.'
            });
        }

        // 2. Valida o evento e a chave_qr ativa
        const [eventos] = await pool.query(
            `SELECT id, titulo, chave_qr, ativo FROM eventos WHERE id = ?`,
            [id_evento]
        );

        if (eventos.length === 0 || !eventos[0].ativo) {
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Evento não encontrado ou inativo.'
            });
        }

        const evento = eventos[0];

        if (evento.chave_qr !== chave_qr) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'QR Code expirado ou inválido.'
            });
        }

        // 3. Registra na tabela presenca_eventos salvando id_evento, id_integrante e nome_colete
        await pool.query(
            `INSERT INTO presenca_eventos (id_evento, id_integrante, nome_colete, presente, data_criacao)
             VALUES (?, ?, ?, 1, NOW())
             ON DUPLICATE KEY UPDATE presente = 1, nome_colete = VALUES(nome_colete), data_modificacao = NOW()`,
            [id_evento, id_integrante, integrante.nome_colete]
        );

        return res.status(200).json({
            sucesso: true,
            mensagem: `Presença confirmada para ${integrante.nome_colete}!`,
            dados: {
                id_evento,
                evento: evento.titulo,
                id_integrante,
                nome_colete: integrante.nome_colete,
                data_confirmacao: new Date()
            }
        });

    } catch (erro) {
        console.error('Erro ao validar presença:', erro);
        return res.status(500).json({
            sucesso: false,
            mensagem: 'Erro interno ao processar chamada.',
            detalhe: erro.message
        });
    }
});

/**
 * @route   GET /api/presencas/eventos/:id
 * @desc    Lista presenças confirmadas de um evento específico
 */
router.get('/eventos/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await pool.query(
            `SELECT 
                pe.id,
                pe.id_integrante,
                pe.nome_colete,
                pe.presente,
                pe.justificativa_falta,
                pe.justificativa_aceita,
                DATE_FORMAT(pe.data_criacao, '%d/%m/%Y %H:%i:%s') AS data_confirmacao
             FROM presenca_eventos pe
             WHERE pe.id_evento = ? AND pe.presente = 1
             ORDER BY pe.data_criacao ASC`,
            [id]
        );

        return res.status(200).json({
            sucesso: true,
            total_presentes: rows.length,
            dados: rows
        });

    } catch (erro) {
        console.error('Erro ao listar presenças do evento:', erro);
        return res.status(500).json({
            sucesso: false,
            mensagem: 'Erro interno ao buscar lista de presenças.',
            detalhe: erro.message
        });
    }
});

module.exports = router;