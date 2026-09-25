const BaseModel = require('./BaseModel');
const db = require('../config/database');

class MemberModel extends BaseModel {
    constructor() {
        // Inicializa a BaseModel com o nome da tabela e a chave primária
        super('members', 'id'); 
    }

    /**
     * Busca um membro pelo Email
     * @param {string} email 
     * @returns {Promise<Object|null>}
     */
    async findByEmail(email) {
        if (!email) return null;

        const [rows] = await db.query(
            `SELECT * FROM ${this.tableName} WHERE email = ?`,
            [email]
        );

        return rows.length > 0 ? rows[0] : null;
    }

    /**
     * Busca um membro pelo CPF
     * @param {string} cpf 
     * @returns {Promise<Object|null>}
     */
    async findByCpf(cpf) {
        if (!cpf) return null;

        const [rows] = await db.query(
            `SELECT * FROM ${this.tableName} WHERE cpf = ?`,
            [cpf]
        );

        return rows.length > 0 ? rows[0] : null;
    }

    /**
     * Busca um membro específico e mapeia todos os times em que ele está (ou já esteve)
     * @param {number} memberId 
     * @returns {Promise<Object|null>}
     */
    async findWithTeams(memberId) {
        if (!memberId) return null;

        // Utilizamos LEFT JOIN para que, se o membro não tiver equipe, ele ainda seja retornado
        const query = `
            SELECT 
                m.*, 
                ipe.id_equipe AS team_id, 
                eq.nome_equipe AS team_name
            FROM ${this.tableName} m
            LEFT JOIN integrante_por_equipe ipe ON m.id = ipe.id_integrante
            LEFT JOIN equipes_especiais eq ON ipe.id_equipe = eq.id
            WHERE m.id = ?
        `;

        const [rows] = await db.query(query, [memberId]);

        if (!rows || rows.length === 0) return null;

        // O primeiro registro já contém os dados básicos do membro (que se repetem nas outras linhas)
        const memberInfo = {
            id: rows[0].id,
            nome: rows[0].nome,
            email: rows[0].email,
            cpf: rows[0].cpf,
            teams: [] // Array que receberá os times
        };

        // Itera sobre as linhas retornadas pelo banco para agrupar as equipes
        rows.forEach(row => {
            if (row.team_id) {
                memberInfo.teams.push({
                    id: row.team_id,
                    name: row.team_name
                });
            }
        });

        return memberInfo;
    }
}

module.exports = MemberModel;