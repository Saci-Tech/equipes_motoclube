const BaseModel = require('./BaseModel');
const db = require('../config/database');

class EventModel extends BaseModel {
    constructor() {
        super('eventos');
    }

    deserialize(row) {
        if (!row) return null;
        return {
            id: row.id,
            name: row.nome,
            type: row.tipo,
            eventDate: row.data_evento,
            location: row.local,
            status: row.status,
            description: row.descricao
        };
    }

    serialize(payload) {
        if (!payload) return {};
        const mapped = {};
        if (payload.name !== undefined) mapped.nome = payload.name;
        if (payload.type !== undefined) mapped.tipo = payload.type;
        if (payload.eventDate !== undefined) mapped.data_evento = payload.eventDate;
        if (payload.location !== undefined) mapped.local = payload.location;
        if (payload.status !== undefined) mapped.status = payload.status;
        if (payload.description !== undefined) mapped.descricao = payload.description;
        return mapped;
    }

    async findByType(type) {
        const [rows] = await db.promise().query(
            `SELECT * FROM ${this.tableName} WHERE tipo = ?`,
            [type]
        );
        return this.deserializeList(rows);
    }

    async findByStatus(status) {
        const [rows] = await db.promise().query(
            `SELECT * FROM ${this.tableName} WHERE status = ?`,
            [status]
        );
        return this.deserializeList(rows);
    }

    async findByDateRange(startDate, endDate) {
        const [rows] = await db.promise().query(
            `SELECT * FROM ${this.tableName} WHERE data_evento BETWEEN ? AND ?`,
            [startDate, endDate]
        );
        return this.deserializeList(rows);
    }
}

module.exports = new EventModel();