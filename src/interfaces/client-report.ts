export interface ReportClientData {
    diaAgendamento: string
    logadouro: string
    complemento?: number
    nome: string
    valor: string
    map<T>(callbackfn: (value: ReportClientData) => T): T[]
    forEach(callbackfn: (value: ReportClientData, index: number, array: ReportClientData[]) => void): void
}