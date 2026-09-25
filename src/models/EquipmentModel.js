const BaseModel = require('./BaseModel');
const db = require('../config/database');

class EquipmentModel extends BaseModel {
    constructor() {
        super('equipamentos', 'id');
    }

    async findByName(nome) {
        if (!nome) return null;
        const [rows] = await db.query(
            `SELECT * FROM ${this.tableName} WHERE nome = ?`,
            [nome]
        );
        return rows.length > 0 ? rows[0] : null;
    }

    async findWithMembers(equipmentId) {
        if (!equipmentId) return null;
        const query = `
            SELECT 
                e.id, e.nome, e.descricao, e.ativo,
                ie.id_integrante,
                i.nome AS integrante_nome,
                ie.data_retirada,
                ie.data_devolucao
            FROM ${this.tableName} e
            LEFT JOIN integrante_equipamento ie ON e.id = ie.id_equipamento
            LEFT JOIN integrantes i ON ie.id_integrante = i.id
            WHERE e.id = ?
        `;
        const [rows] = await db.query(query, [equipmentId]);

        if (!rows || rows.length === 0) return null;

        const equipmentInfo = {
            id: rows[0].id,
            nome: rows[0].nome,
            descricao: rows[0].descricao,
            ativo: rows[0].ativo,
            assignments: [] 
        };

        rows.forEach(row => {
            if (row.id_integrante) {
                equipmentInfo.assignments.push({
                    member_id: row.id_integrante,
                    member_name: row.integrante_nome,
                    checkout_date: row.data_retirada,
                    return_date: row.data_devolucao
                });
            }
        });

        return equipmentInfo;
    }
}

module.exports = EquipmentModel;