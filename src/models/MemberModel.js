const BaseModel = require('./BaseModel');
const db = require('../config/database');

class MemberModel extends BaseModel {
    constructor() {
        super('integrantes');
    }

    /**
     * De/Para: Banco de Dados (snake_case/PT) -> Payload da API (camelCase/EN)
     */
    deserialize(row) {
        if (!row) return null;
        return {
            id: row.id,
            fullName: row.nome_completo,
            shirtName: row.nome_colete,
            email: row.email,
            phone: row.telefone,
            cpf: row.cpf,
            status: row.status,
            teamId: row.id_equipe,
            qrKey: row.chave_qr
        };
    }

    /**
     * De/Para: Payload da API (camelCase/EN) -> Banco de Dados (snake_case/PT)
     */
    serialize(payload) {
        if (!payload) return {};
        const mapped = {};
        if (payload.fullName !== undefined) mapped.nome_completo = payload.fullName;
        if (payload.shirtName !== undefined) mapped.nome_colete = payload.shirtName;
        if (payload.email !== undefined) mapped.email = payload.email;
        if (payload.phone !== undefined) mapped.telefone = payload.phone;
        if (payload.cpf !== undefined) mapped.cpf = payload.cpf;
        if (payload.status !== undefined) mapped.status = payload.status;
        if (payload.teamId !== undefined) mapped.id_equipe = payload.teamId;
        if (payload.qrKey !== undefined) mapped.chave_qr = payload.qrKey;
        return mapped;
    }

    /**
     * Busca um integrante pelo CPF
     */
    async findByCpf(cpf) {
        const [rows] = await db.promise().query(
            `SELECT * FROM ${this.tableName} WHERE cpf = ?`,
            [cpf]
        );
        return rows.length > 0 ? this.deserialize(rows[0]) : null;
    }

    /**
     * Busca um integrante pela Chave QR Code
     */
    async findByQrKey(qrKey) {
        const [rows] = await db.promise().query(
            `SELECT * FROM ${this.tableName} WHERE chave_qr = ?`,
            [qrKey]
        );
        return rows.length > 0 ? this.deserialize(rows[0]) : null;
    }

    /**
     * Lista integrantes associados a uma equipe específica
     */
    async findByTeamId(teamId) {
        const [rows] = await db.promise().query(
            `SELECT * FROM ${this.tableName} WHERE id_equipe = ?`,
            [teamId]
        );
        return this.deserializeList(rows);
    }
}

module.exports = new MemberModel();