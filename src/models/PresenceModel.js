const BaseModel = require('./BaseModel');
const db = require('../config/database');

class PresenceModel extends BaseModel {
    constructor() {
        super('presenca_eventos', 'id');
    }

    /**
     * Busca todos os registros de presença de um evento específico,
     * trazendo os dados do integrante associado.
     * @param {number} eventId 
     * @returns {Promise<Array>}
     */
    async findByEvent(eventId) {
        if (!eventId) return [];

        const query = `
            SELECT 
                pe.*, 
                i.nome AS integrante_nome 
            FROM ${this.tableName} pe
            INNER JOIN integrantes i ON pe.id_integrante = i.id
            WHERE pe.id_evento = ?
        `;

        const [rows] = await db.query(query, [eventId]);
        return rows;
    }

    /**
     * Busca todo o histórico de presenças/faltas de um integrante específico,
     * trazendo os dados do evento associado.
     * @param {number} memberId 
     * @returns {Promise<Array>}
     */
    async findByMember(memberId) {
        if (!memberId) return [];

        const query = `
            SELECT 
                pe.*, 
                e.nome AS evento_nome,
                e.data_evento 
            FROM ${this.tableName} pe
            INNER JOIN eventos e ON pe.id_evento = e.id
            WHERE pe.id_integrante = ?
            ORDER BY e.data_evento DESC
        `;

        const [rows] = await db.query(query, [memberId]);
        return rows;
    }

    /**
     * Busca o registro de presença específico de um integrante em um evento.
     * Útil para validações antes de atualizar justificativas ou marcar presença.
     * @param {number} eventId 
     * @param {number} memberId 
     * @returns {Promise<Object|null>}
     */
    async findByEventAndMember(eventId, memberId) {
        if (!eventId || !memberId) return null;

        const query = `
            SELECT * FROM ${this.tableName} 
            WHERE id_evento = ? AND id_integrante = ? 
            LIMIT 1
        `;

        const [rows] = await db.query(query, [eventId, memberId]);
        return rows.length > 0 ? rows[0] : null;
    }
}

module.exports = PresenceModel;