/**
 * Mocks centralizados para testes unitários da MemberEquipmentModel
 */
const memberEquipmentModelMock = {
    activeAssignment: {
        id: 1,
        id_integrante: 10,
        id_equipamento: 5,
        data_retirada: '2023-10-01T10:00:00.000Z',
        data_devolucao: null
    },
    memberHistory: [
        {
            id: 1,
            id_integrante: 10,
            id_equipamento: 5,
            data_retirada: '2023-10-01T10:00:00.000Z',
            data_devolucao: null,
            equipamento_nome: 'Rádio Comunicador HT' // Dado oriundo do INNER JOIN
        },
        {
            id: 2,
            id_integrante: 10,
            id_equipamento: 3,
            data_retirada: '2023-09-01T08:00:00.000Z',
            data_devolucao: '2023-09-05T18:00:00.000Z',
            equipamento_nome: 'Lanterna Tática'
        }
    ]
};

module.exports = memberEquipmentModelMock;