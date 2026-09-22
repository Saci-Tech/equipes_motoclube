// =========================================================================
// ROTA / CONTROLLER: Gestão Unificada de Integrantes
// ARQUIVO: src/routes/integrantes.routes.js
// =========================================================================

const express = require('express');
const router = express.Router();
const db = require('../config/database'); // Pool mysql2/promise

/**
 * =========================================================================
 * 1. CONSULTA DE PERFIL CONSOLIDADO DO INTEGRANTE
 * @route GET /api/integrantes/perfil/:id
 * =========================================================================
 */
router.get('/perfil/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // A. Dados cadastrais do integrante
        const [rowsIntegrante] = await db.query(
            `SELECT 
                id, 
                nome_completo, 
                nome_colete, 
                telefone, 
                email, 
                DATE_FORMAT(data_entrada, '%d/%m/%Y') AS data_entrada, 
                divisao, 
                IF(ativo, 'SIM', 'NÃO') AS ativo 
             FROM integrantes 
             WHERE id = ?`,
            [id]
        );

        if (rowsIntegrante.length === 0) {
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Integrante não encontrado.'
            });
        }

        const integrante = rowsIntegrante[0];

        // B. Equipes especiais associadas (vw_perfil_integrante_equipes)
        const [rowsEquipes] = await db.query(
            `SELECT 
                id_equipe, 
                nome_equipe, 
                categoria, 
                posicao, 
                ativo_na_equipe, 
                data_entrada_equipe, 
                tempo_servico_meses, 
                presencas_historico, 
                faltas_historico, 
                media_historico, 
                presencas_semestre, 
                faltas_semestre, 
                media_semestre 
             FROM vw_perfil_integrante_equipes 
             WHERE id_integrante = ?`,
            [id]
        );

        // C. Equipamentos associados (vw_integrante_equipamentos)
        const [rowsEquipamentos] = await db.query(
            `SELECT 
                id_equipamento, 
                nome_equipamento, 
                categoria, 
                propriedade, 
                detalhes, 
                data_atribuicao 
             FROM vw_integrante_equipamentos 
             WHERE id_integrante = ?`,
            [id]
        );

        return res.status(200).json({
            sucesso: true,
            dados: {
                id_integrante: integrante.id,
                nome_completo: integrante.nome_completo,
                nome_colete: integrante.nome_colete,
                telefone: integrante.telefone,
                email: integrante.email,
                data_entrada: integrante.data_entrada,
                divisao: integrante.divisao,
                ativo: integrante.ativo,

                total_equipes: rowsEquipes.length,
                equipes: rowsEquipes.map(e => ({
                    id_equipe: e.id_equipe,
                    nome: e.nome_equipe,
                    categoria: e.categoria,
                    posicao: e.posicao,
                    ativo: e.ativo_na_equipe,
                    data_entrada: e.data_entrada_equipe,
                    tempo_servico_meses: e.tempo_servico_meses,
                    desempenho: {
                        historico: {
                            presencas: e.presencas_historico,
                            faltas: e.faltas_historico,
                            media: e.media_historico
                        },
                        semestre_atual: {
                            presencas: e.presencas_semestre,
                            faltas: e.faltas_semestre,
                            media: e.media_semestre
                        }
                    }
                })),

                total_equipamentos: rowsEquipamentos.length,
                equipamentos: rowsEquipamentos.map(eq => ({
                    id_equipamento: eq.id_equipamento,
                    nome: eq.nome_equipamento,
                    categoria: eq.categoria,
                    propriedade: eq.propriedade,
                    detalhes: eq.detalhes,
                    data_atribuicao: eq.data_atribuicao
                }))
            }
        });

    } catch (error) {
        console.error('Erro ao consultar perfil:', error);
        return res.status(500).json({
            sucesso: false,
            mensagem: 'Erro interno do servidor ao carregar o perfil.',
            erro: error.message
        });
    }
});

/**
 * =========================================================================
 * 2. CADASTRO DE INTEGRANTE COM EQUIPES E EQUIPAMENTOS
 * @route POST /api/integrantes
 * =========================================================================
 */
router.post('/', async (req, res) => {
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        const {
            nome_completo,
            nome_colete,
            telefone,
            email,
            data_entrada,
            divisao,
            ativo = true,
            equipes = [],       
            equipamentos = []   
        } = req.body;

        // Inserção na tabela integrantes
        const [resultIntegrante] = await connection.query(
            `INSERT INTO integrantes 
                (nome_completo, nome_colete, telefone, email, data_entrada, divisao, ativo) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [nome_completo, nome_colete, telefone, email, data_entrada, divisao, ativo]
        );

        const idIntegrante = resultIntegrante.insertId;

        if (ativo) {
            // Vínculo com Equipes Especiais (Triggers controlam vagas/transbordo no MySQL)
            for (const eq of equipes) {
                await connection.query(
                    `INSERT INTO integrante_por_equipe 
                        (id_equipe, id_integrante, categoria_equipe, ativo, data_entrada) 
                     VALUES (?, ?, ?, TRUE, NOW())`,
                    [eq.id_equipe, idIntegrante, eq.categoria || 'TITULAR']
                );
            }

            // Vínculo com Equipamentos
            for (const eqp of equipamentos) {
                await connection.query(
                    `INSERT INTO integrante_equipamento 
                        (id_integrante, id_equipamento, propriedade, detalhes) 
                     VALUES (?, ?, ?, ?)`,
                    [idIntegrante, eqp.id_equipamento, eqp.propriedade || 'PARTICULAR', eqp.detalhes || null]
                );
            }
        }

        await connection.commit();

        return res.status(201).json({
            sucesso: true,
            mensagem: 'Integrante cadastrado com sucesso!',
            id_integrante: idIntegrante
        });

    } catch (error) {
        await connection.rollback();
        console.error('Erro ao cadastrar integrante:', error);
        return res.status(500).json({
            sucesso: false,
            mensagem: 'Erro interno ao cadastrar integrante.',
            erro: error.message
        });
    } finally {
        connection.release();
    }
});

/**
 * =========================================================================
 * 3. ATUALIZAÇÃO OU DESATIVAÇÃO DO INTEGRANTE
 * @route PUT /api/integrantes/:id
 * =========================================================================
 */
router.put('/:id', async (req, res) => {
    const connection = await db.getConnection();
    const { id } = req.params;

    try {
        await connection.beginTransaction();

        const {
            nome_completo,
            nome_colete,
            telefone,
            email,
            data_entrada,
            divisao,
            ativo,
            equipes = [],       
            equipamentos = []   
        } = req.body;

        // Atualização da tabela principal
        await connection.query(
            `UPDATE integrantes 
             SET nome_completo = ?, nome_colete = ?, telefone = ?, email = ?, 
                 data_entrada = ?, divisao = ?, ativo = ? 
             WHERE id = ?`,
            [nome_completo, nome_colete, telefone, email, data_entrada, divisao, ativo, id]
        );

        if (!ativo) {
            // Se inativado: limpa equipamentos. 
            // O trigger 'trg_integrantes_after_update' do MySQL inativa as equipes automaticamente.
            await connection.query(
                `DELETE FROM integrante_equipamento WHERE id_integrante = ?`,
                [id]
            );
        } else {
            // Sincronização de Equipamentos (Substituição)
            await connection.query(
                `DELETE FROM integrante_equipamento WHERE id_integrante = ?`,
                [id]
            );

            for (const eqp of equipamentos) {
                await connection.query(
                    `INSERT INTO integrante_equipamento 
                        (id_integrante, id_equipamento, propriedade, detalhes) 
                     VALUES (?, ?, ?, ?)`,
                    [id, eqp.id_equipamento, eqp.propriedade || 'PARTICULAR', eqp.detalhes || null]
                );
            }

            // Sincronização de Equipes Especiais
            const idsEquipesSelecionadas = equipes.map(e => e.id_equipe);

            if (idsEquipesSelecionadas.length > 0) {
                await connection.query(
                    `UPDATE integrante_por_equipe 
                     SET ativo = FALSE 
                     WHERE id_integrante = ? AND id_equipe NOT IN (?) AND ativo = TRUE`,
                    [id, idsEquipesSelecionadas]
                );
            } else {
                await connection.query(
                    `UPDATE integrante_por_equipe 
                     SET ativo = FALSE 
                     WHERE id_integrante = ? AND ativo = TRUE`,
                    [id]
                );
            }

            for (const eq of equipes) {
                const [vincExistente] = await connection.query(
                    `SELECT id, ativo FROM integrante_por_equipe 
                     WHERE id_integrante = ? AND id_equipe = ?`,
                    [id, eq.id_equipe]
                );

                if (vincExistente.length === 0) {
                    await connection.query(
                        `INSERT INTO integrante_por_equipe 
                            (id_equipe, id_integrante, categoria_equipe, ativo, data_entrada) 
                         VALUES (?, ?, ?, TRUE, NOW())`,
                        [eq.id_equipe, id, eq.categoria || 'TITULAR']
                    );
                } else if (!vincExistente[0].ativo) {
                    await connection.query(
                        `UPDATE integrante_por_equipe 
                         SET ativo = TRUE, categoria_equipe = ? 
                         WHERE id = ?`,
                        [eq.categoria || 'TITULAR', vincExistente[0].id]
                    );
                }
            }
        }

        await connection.commit();

        return res.status(200).json({
            sucesso: true,
            mensagem: 'Cadastro do integrante atualizado com sucesso!'
        });

    } catch (error) {
        await connection.rollback();
        console.error('Erro ao atualizar integrante:', error);
        return res.status(500).json({
            sucesso: false,
            mensagem: 'Erro interno ao atualizar integrante.',
            erro: error.message
        });
    } finally {
        connection.release();
    }
});

module.exports = router;