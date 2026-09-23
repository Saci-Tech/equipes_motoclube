const BaseModel = require('./BaseModel');
const db = require('../config/database');

class EquipmentModel extends BaseModel {
    constructor() {
        super('equipamentos');
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
            serialNumber: row.numero_serie,
            status: row.status,
            notes: row.observacoes
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
        if (payload.serialNumber !== undefined) mapped.numero_serie = payload.serialNumber;
        if (payload.status !== undefined) mapped.status = payload.status;
        if (payload.notes !== undefined) mapped.observacoes = payload.notes;
        return mapped;
    }

    /**
     * Busca equipamento pelo número de série único
     */
    async findBySerialNumber(serialNumber) {
        const [rows] = await db.promise().query(
            `SELECT * FROM ${this.tableName} WHERE numero_serie = ?`,
            [serialNumber]
        );
        return rows.length > 0 ? this.deserialize(rows[0]) : null;
    }

    /**
     * Busca equipamentos por categoria
     */
    async findByCategory(category) {
        const [rows] = await db.promise().query(
            `SELECT * FROM ${this.tableName} WHERE categoria = ?`,
            [category]
        );
        return this.deserializeList(rows);
    }

    /**
     * Busca equipamentos por status (ex: 'DISPONIVEL', 'EM_USO', 'MANUTENCAO')
     */
    async findByStatus(status) {
        const [rows] = await db.promise().query(
            `SELECT * FROM ${this.tableName} WHERE status = ?`,
            [status]
        );
        return this.deserializeList(rows);
    }
}

module.exports = new EquipmentModel();