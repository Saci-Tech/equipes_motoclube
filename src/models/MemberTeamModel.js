const BaseModel = require('./BaseModel');
const db = require('../config/database');

class MemberTeamModel extends BaseModel {
    constructor() {
        super('integrante_por_equipe', 'id');
    }

    /**
     * Busca todos os integrantes vinculados a uma equipe específica
     * @param {number} teamId 
     * @returns {Promise<Array|null>}
     */
    async findByTeam(teamId) {
        if (!teamId) return null;

        const query = `
            SELECT 
                ipe.*, 
                i.nome AS integrante_nome,
                i.email AS integrante_email
            FROM ${this.tableName} ipe
            INNER JOIN integrantes i ON ipe.id_integrante = i.id
            WHERE ipe.id_equipe = ?
        `;

        const [rows] = await db.query(query, [teamId]);

        return rows.length > 0 ? rows : [];
    }

    /**
     * Verifica se um integrante já está cadastrado em uma equipe específica
     * @param {number} memberId 
     * @param {number} teamId 
     * @returns {Promise<Object|null>}
     */
    async checkMembership(memberId, teamId) {
        if (!memberId || !teamId) return null;

        const query = `
            SELECT * FROM ${this.tableName} 
            WHERE id_integrante = ? AND id_equipe = ? 
            LIMIT 1
        `;

        const [rows] = await db.query(query, [memberId, teamId]);

        return rows.length > 0 ? rows[0] : null;
    }
}

module.exports = MemberTeamModel;