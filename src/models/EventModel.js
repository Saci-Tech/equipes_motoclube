const BaseModel = require('./BaseModel');
const db = require('../config/database');

class EventModel extends BaseModel {
    constructor() {
        super('eventos');
    }

    /**
     * De/Para: Banco de Dados (snake_case/PT) -> Payload da API (camelCase/EN)
     */
    deserialize(row) {
        if (!row) return null;
        return {
            id: row.id,
            title: row.nome,
            eventDate: row.data_evento,
            location: row.localizacao,
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
        if (payload.title !== undefined) mapped.nome = payload.title;
        if (payload.eventDate !== undefined) mapped.data_evento = payload.eventDate;
        if (payload.location !== undefined) mapped.localizacao = payload.location;
        if (payload.status !== undefined) mapped.status = payload.status;
        if (payload.description !== undefined) mapped.descricao = payload.description;
        return mapped;
    }

    /**
     * Busca eventos por intervalo de datas
     */
    async findByDateRange(startDate, endDate) {
        const [rows] = await db.promise().query(
            `SELECT * FROM ${this.tableName} WHERE data_evento BETWEEN ? AND ? ORDER BY data_evento ASC`,
            [startDate, endDate]
        );
        return this.deserializeList(rows);
    }

    /**
     * Busca eventos por status (ex: 'AGENDADO', 'CONCLUIDO', 'CANCELADO')
     */
    async findByStatus(status) {
        const [rows] = await db.promise().query(
            `SELECT * FROM ${this.tableName} WHERE status = ? ORDER BY data_evento DESC`,
            [status]
        );
        return this.deserializeList(rows);
    }
}

module.exports = new EventModel();