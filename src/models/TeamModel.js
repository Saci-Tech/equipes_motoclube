const BaseModel = require('./BaseModel');
const db = require('../config/database');

class TeamModel extends BaseModel {
    constructor() {
        super('equipes');
    }

    /**
     * De/Para: Banco de Dados (snake_case/PT) -> Payload da API (camelCase/EN)
     */
    deserialize(row) {
        if (!row) return null;
        return {
            id: row.id,
            name: row.nome,
            category: row.categoria,
            status: row.status,
            description: row.descricao
        };
    }

    /**
     * De/Para: Payload da API (camelCase/EN) -> Banco de Dados (snake_case/PT)
     */
    serialize(payload) {
        if (!payload) return {};
        const mapped = {};
        if (payload.name !== undefined) mapped.nome = payload.name;
        if (payload.category !== undefined) mapped.categoria = payload.category;
        if (payload.status !== undefined) mapped.status = payload.status;
        if (payload.description !== undefined) mapped.descricao = payload.description;
        return mapped;
    }

    /**
     * Busca equipe pelo nome exato
     */
    async findByName(name) {
        const [rows] = await db.promise().query(
            `SELECT * FROM ${this.tableName} WHERE nome = ?`,
            [name]
        );
        return rows.length > 0 ? this.deserialize(rows[0]) : null;
    }

    /**
     * Lista equipes por categoria
     */
    async findByCategory(category) {
        const [rows] = await db.promise().query(
            `SELECT * FROM ${this.tableName} WHERE categoria = ?`,
            [category]
        );
        return this.deserializeList(rows);
    }
}

module.exports = new TeamModel();