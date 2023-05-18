export interface CompleteEventData {
    diaAgendamento: string
    agendamentoId: number
    proprietarioid: number
    propriedadeId: number
    nome: string
    email: string
    contato: string
    cidade: string
    cep: string
    logadouro: string
    numero: string
    complemento?: string
    bairro: string
    checkout: string
    checkin?: string
    senha?: string
    acomodacao?: string
    wifi?: string
    outros?: string
    obsPropriedade?: string
    obs?: string
    cor: number
}