export interface Event {
    agendamentoId: number
    bairro: string
    cep: string
    logadouro: string
    checkin: string
    checkout: string
    cidade: string
    complemento?: string,
    cor: number,
    senha: string
    contato: string
    diaAgendamento: string
    email: string
    nome: string
    numero: string
    obs?: string
    obsPropriedade?: string
    propriedadeId: number
    proprietarioid: number
}