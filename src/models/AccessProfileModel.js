const BaseModel = require('./BaseModel');
const db = require('../config/database');

class AccessProfileModel extends BaseModel {
    constructor() {
        // Inicializa a BaseModel com o nome da tabela e a chave primária
        super('perfis_acesso', 'id');
    }

    /**
     * Busca um perfil de acesso pelo nome
     * Útil para validações de unicidade antes de criar um novo
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
     * Busca um perfil e mapeia todas as suas permissões associadas
     * @param {number} profileId 
     * @returns {Promise<Object|null>}
     */
    async findWithPermissions(profileId) {
        if (!profileId) return null;

        const query = `
            SELECT 
                p.id, p.nome, p.descricao, p.ativo,
                perm.id AS permission_id, 
                perm.nome AS permission_name
            FROM ${this.tableName} p
            LEFT JOIN perfil_permissoes pp ON p.id = pp.id_perfil
            LEFT JOIN permissoes perm ON pp.id_permissao = perm.id
            WHERE p.id = ?
        `;

        const [rows] = await db.query(query, [profileId]);

        if (!rows || rows.length === 0) return null;

        const profileInfo = {
            id: rows[0].id,
            nome: rows[0].nome,
            descricao: rows[0].descricao,
            ativo: rows[0].ativo,
            permissions: []
        };

        rows.forEach(row => {
            if (row.permission_id) {
                profileInfo.permissions.push({
                    id: row.permission_id,
                    name: row.permission_name
                });
            }
        });

        return profileInfo;
    }
}

module.exports = AccessProfileModel;