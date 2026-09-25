const BaseModel = require('./BaseModel');
const db = require('../config/database');

class MemberTeamModel extends BaseModel {
    constructor() {
        super('integrante_por_equipe'); // Mapeado para a tabela do schema.sql
    }

    async findByTeam(teamId) {
        const [rows] = await db.query(`SELECT * FROM ${this.tableName} WHERE id_equipe = ? AND ativo = 1`, [teamId]);
        return rows;
    }

    async findByMember(memberId) {
        const [rows] = await db.query(`SELECT * FROM ${this.tableName} WHERE id_integrante = ? AND ativo = 1`, [memberId]);
        return rows;
    }
}

module.exports = new MemberTeamModel();