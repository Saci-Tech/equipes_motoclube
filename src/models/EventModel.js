const BaseModel = require('./BaseModel');
const db = require('../config/database');

class EventModel extends BaseModel {
    constructor() {
        // Inicializa a BaseModel com a tabela de eventos
        super('eventos', 'id');
    }

    /**
     * Busca um evento pelo nome/título
     * @param {string} nome 
     * @returns {Promise<Object|null>}
     */
    async findByName(nome) {
        if (!nome) return null;

        const [rows] = await db.query(
            `SELECT * FROM ${this.tableName} WHERE nome = ?`,
            [nome]
        );

        return rows.length > 0 ? rows[0] : null;
    }

    /**
     * Busca um evento e lista todos os registros de presença atrelados a ele
     * @param {number} eventId 
     * @returns {Promise<Object|null>}
     */
    async findWithAttendances(eventId) {
        if (!eventId) return null;

        const query = `
            SELECT 
                e.id, e.nome, e.data_evento, e.ativo,
                pe.id_integrante,
                i.nome AS integrante_nome,
                pe.presente,
                pe.justificativa_falta,
                pe.justificativa_aceita
            FROM ${this.tableName} e
            LEFT JOIN presenca_eventos pe ON e.id = pe.id_evento
            LEFT JOIN integrantes i ON pe.id_integrante = i.id
            WHERE e.id = ?
        `;

        const [rows] = await db.query(query, [eventId]);

        if (!rows || rows.length === 0) return null;

        const eventInfo = {
            id: rows[0].id,
            nome: rows[0].nome,
            data_evento: rows[0].data_evento,
            ativo: rows[0].ativo,
            attendances: [] // Lista de presenças e faltas do evento
        };

        rows.forEach(row => {
            if (row.id_integrante) {
                eventInfo.attendances.push({
                    member_id: row.id_integrante,
                    member_name: row.integrante_nome,
                    present: Boolean(row.presente),
                    justification: row.justificativa_falta,
                    justification_accepted: row.justificativa_aceita !== null ? Boolean(row.justificativa_aceita) : null
                });
            }
        });

        return eventInfo;
    }
}

module.exports = EventModel;