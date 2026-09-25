/**
 * Mocks centralizados para testes unitários da MemberModel
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
            team_name: 'Equipe Alpha'
        },
        {
            id: 1,
            nome: 'João Silva',
            email: 'joao@example.com',
            cpf: '12345678900',
            team_id: 20,
            team_name: 'Equipe Bravo'
        }
    ],
    validMemberWithTeamsResult: {
        id: 1,
        nome: 'João Silva',
        email: 'joao@example.com',
        cpf: '12345678900',
        teams: [
            { id: 10, name: 'Equipe Alpha' },
            { id: 20, name: 'Equipe Bravo' }
        ]
    },
    validMemberWithoutTeamsRaw: [
        {
            id: 2,
            nome: 'Maria Souza',
            email: 'maria@example.com',
            cpf: '09876543211',
            team_id: null,
            team_name: null
        }
    ],
    validMemberWithoutTeamsResult: {
        id: 2,
        nome: 'Maria Souza',
        email: 'maria@example.com',
        cpf: '09876543211',
        teams: []
    }
};

module.exports = memberModelMock;