const dbRowMock = {
    id: 1,
    nome: 'Equipe Alpha',
    categoria: 'SENIOR',
    status: 'ATIVO',
    descricao: 'Equipe principal de competição'
};

const dbRowListMock = [
    dbRowMock,
    {
        id: 2,
        nome: 'Equipe Beta',
        categoria: 'JUNIOR',
        status: 'ATIVO',
        descricao: 'Equipe de acesso'
    }
];

const apiPayloadMock = {
    name: 'Equipe Alpha',
    category: 'SENIOR',
    status: 'ATIVO',
    description: 'Equipe principal de competição'
};

const deserializedTeamMock = {
    id: 1,
    ...apiPayloadMock
};

const deserializedTeamListMock = [
    deserializedTeamMock,
    {
        id: 2,
        name: 'Equipe Beta',
        category: 'JUNIOR',
        status: 'ATIVO',
        description: 'Equipe de acesso'
    }
];

module.exports = {
    dbRowMock,
    dbRowListMock,
    apiPayloadMock,
    deserializedTeamMock,
    deserializedTeamListMock
};