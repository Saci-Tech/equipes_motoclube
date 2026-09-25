const BaseModel = require('./BaseModel');
const db = require('../config/database');

class TeamModel extends BaseModel {
    constructor() {
        // Inicializa a BaseModel com a tabela de equipes
        super('equipes_especiais', 'id');
    }

    /**
     * Busca uma equipe pelo nome
     * @param {string} nome 
     * @returns {Promise<Object|null>}
     */
    async findByName(nome) {
        if (!nome) return null;

        const [rows] = await db.query(
            `SELECT * FROM ${this.tableName} WHERE nome_equipe = ?`,
            [nome]
        );

        return rows.length > 0 ? rows[0] : null;
    }

    /**
     * Busca uma equipe e mapeia todos os integrantes vinculados a ela
     * @param {number} teamId 
     * @returns {Promise<Object|null>}
     */
    async findWithMembers(teamId) {
        if (!teamId) return null;

        const query = `
            SELECT 
                eq.id, eq.nome_equipe, eq.descricao, eq.ativo,
                ipe.id_integrante,
                i.nome AS integrante_nome,
                i.email AS integrante_email
            FROM ${this.tableName} eq
            LEFT JOIN integrante_por_equipe ipe ON eq.id = ipe.id_equipe
            LEFT JOIN integrantes i ON ipe.id_integrante = i.id
            WHERE eq.id = ?
        `;

        const [rows] = await db.query(query, [teamId]);

        if (!rows || rows.length === 0) return null;

        const teamInfo = {
            id: rows[0].id,
            nome_equipe: rows[0].nome_equipe,
            descricao: rows[0].descricao,
            ativo: rows[0].ativo,
            members: [] // Array que receberá os integrantes
        };

        rows.forEach(row => {
            if (row.id_integrante) {
                teamInfo.members.push({
                    member_id: row.id_integrante,
                    member_name: row.integrante_nome,
                    member_email: row.integrante_email
                });
            }
        });

        return teamInfo;
    }
}

module.exports = TeamModel;