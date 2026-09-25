const memberTeamModelMock = {
    membershipRecord: {
        id: 1,
        id_integrante: 10,
        id_equipe: 5
    },
    teamMembers: [
        {
            id: 1,
            id_integrante: 10,
            id_equipe: 5,
            integrante_nome: 'João Silva',
            integrante_email: 'joao@example.com'
        },
        {
            id: 2,
            id_integrante: 20,
            id_equipe: 5,
            integrante_nome: 'Maria Souza',
            integrante_email: 'maria@example.com'
        }
    ]
};

module.exports = memberTeamModelMock;