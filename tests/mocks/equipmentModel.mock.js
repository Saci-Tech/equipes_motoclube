const equipmentModelMock = {
    validEquipment: {
        id: 1,
        nome: 'Rádio Comunicador HT',
        descricao: 'Rádio VHF/UHF',
        ativo: 1
    },
    validEquipmentWithMembersRaw: [
        {
            id: 1,
            nome: 'Rádio Comunicador HT',
            descricao: 'Rádio VHF/UHF',
            ativo: 1,
            id_integrante: 10,
            integrante_nome: 'João Silva',
            data_retirada: '2023-01-10T10:00:00.000Z',
            data_devolucao: '2023-01-15T18:00:00.000Z'
        },
        {
            id: 1,
            nome: 'Rádio Comunicador HT',
            descricao: 'Rádio VHF/UHF',
            ativo: 1,
            id_integrante: 20,
            integrante_nome: 'Maria Souza',
            data_retirada: '2023-02-01T09:00:00.000Z',
            data_devolucao: null
        }
    ],
    validEquipmentWithMembersResult: {
        id: 1,
        nome: 'Rádio Comunicador HT',
        descricao: 'Rádio VHF/UHF',
        ativo: 1,
        assignments: [
            { member_id: 10, member_name: 'João Silva', checkout_date: '2023-01-10T10:00:00.000Z', return_date: '2023-01-15T18:00:00.000Z' },
            { member_id: 20, member_name: 'Maria Souza', checkout_date: '2023-02-01T09:00:00.000Z', return_date: null }
        ]
    },
    validEquipmentWithoutMembersRaw: [
        {
            id: 2,
            nome: 'Lanterna Tática',
            descricao: 'Lanterna LED 1000 lumens',
            ativo: 1,
            id_integrante: null,
            integrante_nome: null,
            data_retirada: null,
            data_devolucao: null
        }
    ],
    validEquipmentWithoutMembersResult: {
        id: 2,
        nome: 'Lanterna Tática',
        descricao: 'Lanterna LED 1000 lumens',
        ativo: 1,
        assignments: []
    }
};

module.exports = equipmentModelMock;