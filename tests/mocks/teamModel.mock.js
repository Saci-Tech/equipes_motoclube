/**
 * Mocks centralizados para testes unitários da TeamModel
 */
const teamModelMock = {
    validTeam: {
        id: 1,
        nome_equipe: 'Equipe Alpha',
        descricao: 'Equipe de Resgate Avançado',
        ativo: 1
    },
    validTeamWithMembersRaw: [
        {
            id: 1,
            nome_equipe: 'Equipe Alpha',
            descricao: 'Equipe de Resgate Avançado',
            ativo: 1,
            id_integrante: 10,
            integrante_nome: 'João Silva',
            integrante_email: 'joao@example.com'
        },
        {
            id: 1,
            nome_equipe: 'Equipe Alpha',
            descricao: 'Equipe de Resgate Avançado',
            ativo: 1,
            id_integrante: 20,
            integrante_nome: 'Maria Souza',
            integrante_email: 'maria@example.com'
        }
    ],
    validTeamWithMembersResult: {
        id: 1,
        nome_equipe: 'Equipe Alpha',
        descricao: 'Equipe de Resgate Avançado',
        ativo: 1,
        members: [
            { member_id: 10, member_name: 'João Silva', member_email: 'joao@example.com' },
            { member_id: 20, member_name: 'Maria Souza', member_email: 'maria@example.com' }
        ]
    },
    validTeamWithoutMembersRaw: [
        {
            id: 2,
            nome_equipe: 'Equipe Beta',
            descricao: 'Equipe de Logística',
            ativo: 1,
            id_integrante: null,
            integrante_nome: null,
            integrante_email: null
        }
    ],
    validTeamWithoutMembersResult: {
        id: 2,
        nome_equipe: 'Equipe Beta',
        descricao: 'Equipe de Logística',
        ativo: 1,
        members: []
    }
};

module.exports = teamModelMock;