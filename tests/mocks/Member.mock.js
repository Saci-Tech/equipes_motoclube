const dbRowMock = {
    id: 1,
    nome_completo: 'Carlos Silva',
    nome_colete: 'Silva',
    email: 'carlos@clube.com',
    telefone: '11999998888',
    cpf: '12345678901',
    status: 'ATIVO',
    id_equipe: 10,
    chave_qr: 'UUID-QR-123'
};

const dbRowListMock = [
    dbRowMock,
    {
        id: 2,
        nome_completo: 'Ana Souza',
        nome_colete: 'Souza',
        email: 'ana@clube.com',
        telefone: '11988887777',
        cpf: '98765432100',
        status: 'ATIVO',
        id_equipe: 10,
        chave_qr: 'UUID-QR-456'
    }
];

const apiPayloadMock = {
    fullName: 'Carlos Silva',
    shirtName: 'Silva',
    email: 'carlos@clube.com',
    phone: '11999998888',
    cpf: '12345678901',
    status: 'ATIVO',
    teamId: 10,
    qrKey: 'UUID-QR-123'
};

module.exports = {
    dbRowMock,
    dbRowListMock,
    apiPayloadMock
};