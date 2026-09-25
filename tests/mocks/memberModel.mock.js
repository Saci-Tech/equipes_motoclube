/**
 * Mocks centralizados para testes unitários do MemberModel
 */
const memberModelMock = {
    validMember: {
        id: 1,
        nome: 'João Silva',
        email: 'joao@example.com',
        cpf: '12345678900'
    },
    validMemberWithTeamsRaw: [
        {
            id: 1,
            nome: 'João Silva',
            email: 'joao@example.com',
            cpf: '12345678900',
            team_id: 10,
            team_name: 'Time Alpha'
        },
        {
            id: 1,
            nome: 'João Silva',
            email: 'joao@example.com',
            cpf: '12345678900',
            team_id: 20,
            team_name: 'Time Beta'
        }
    ],
    validMemberWithTeamsResult: {
        id: 1,
        nome: 'João Silva',
        email: 'joao@example.com',
        cpf: '12345678900',
        teams: [
            { id: 10, name: 'Time Alpha' },
            { id: 20, name: 'Time Beta' }
        ]
    },
    validMemberWithoutTeamsRaw: [
        {
            id: 2,
            nome: 'Maria Souza',
            email: 'maria@example.com',
            cpf: '98765432100',
            team_id: null,
            team_name: null
        }
    ],
    validMemberWithoutTeamsResult: {
        id: 2,
        nome: 'Maria Souza',
        email: 'maria@example.com',
        cpf: '98765432100',
        teams: []
    }
};

module.exports = memberModelMock;