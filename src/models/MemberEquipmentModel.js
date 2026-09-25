const BaseModel = require('./BaseModel');
const db = require('../config/database');

class MemberEquipmentModel extends BaseModel {
    constructor() {
        // Inicializa a BaseModel com a tabela de relação entre integrantes e equipamentos
        super('integrante_equipamento', 'id');
    }

    /**
     * Busca o empréstimo ativo de um equipamento específico.
     * Retorna o registro se o equipamento estiver com alguém (data_devolucao IS NULL).
     * @param {number} equipmentId 
     * @returns {Promise<Object|null>}
     */
    async findActiveByEquipment(equipmentId) {
        if (!equipmentId) return null;

        const [rows] = await db.query(
            `SELECT * FROM ${this.tableName} WHERE id_equipamento = ? AND data_devolucao IS NULL LIMIT 1`,
            [equipmentId]
        );

        return rows.length > 0 ? rows[0] : null;
    }

    /**
     * Busca todo o histórico de equipamentos de um integrante específico,
     * juntando com a tabela de equipamentos para trazer o nome do item.
     * @param {number} memberId 
     * @returns {Promise<Array|null>}
     */
    async findByMember(memberId) {
        if (!memberId) return null;

        const query = `
            SELECT 
                ie.*, 
                e.nome AS equipamento_nome 
            FROM ${this.tableName} ie
            INNER JOIN equipamentos e ON ie.id_equipamento = e.id
            WHERE ie.id_integrante = ?
            ORDER BY ie.data_retirada DESC
        `;

        const [rows] = await db.query(query, [memberId]);

        return rows.length > 0 ? rows : [];
    }
}

module.exports = MemberEquipmentModel;