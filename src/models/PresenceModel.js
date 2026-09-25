const BaseModel = require('./BaseModel');
const db = require('../config/database');

class PresenceModel extends BaseModel {
    constructor() {
        super('presenca_eventos');
    }

    /**
     * De/Para: Banco de Dados (snake_case/PT) -> Payload da API (camelCase/EN)
     */
    deserialize(row) {
        if (!row) return null;
        return {
            id: row.id,
            memberId: row.id_integrante,
            eventId: row.id_evento,
            presenceDate: row.data_presenca,
            status: row.status,
            justification: row.justificativa,
            validationMethod: row.metodo_validacao
        };
    }

    /**
     * De/Para: Payload da API (camelCase/EN) -> Banco de Dados (snake_case/PT)
     */
    serialize(payload) {
        if (!payload) return {};
        const mapped = {};
        if (payload.memberId !== undefined) mapped.id_integrante = payload.memberId;
        if (payload.eventId !== undefined) mapped.id_evento = payload.eventId;
        if (payload.presenceDate !== undefined) mapped.data_presenca = payload.presenceDate;
        if (payload.status !== undefined) mapped.status = payload.status;
        if (payload.justification !== undefined) mapped.justificativa = payload.justification;
        if (payload.validationMethod !== undefined) mapped.metodo_validacao = payload.validationMethod;
        return mapped;
    }

    /**
     * Busca os registros de presença de um evento específico
     */
    async findByEventId(eventId) {
        const [rows] = await db.promise().query(
            `SELECT * FROM ${this.tableName} WHERE id_evento = ?`,
            [eventId]
        );
        return this.deserializeList(rows);
    }

    /**
     * Busca os registros de presença de um integrante específico
     */
    async findByMemberId(memberId) {
        const [rows] = await db.promise().query(
            `SELECT * FROM ${this.tableName} WHERE id_integrante = ?`,
            [memberId]
        );
        return this.deserializeList(rows);
    }

    /**
     * Busca o registro único de presença de um integrante em um evento específico
     */
    async findByEventAndMember(eventId, memberId) {
        const [rows] = await db.promise().query(
            `SELECT * FROM ${this.tableName} WHERE id_evento = ? AND id_integrante = ?`,
            [eventId, memberId]
        );
        return rows.length > 0 ? this.deserialize(rows[0]) : null;
    }
}

module.exports = new PresenceModel();