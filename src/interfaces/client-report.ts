export interface ReportClientData {
    diaAgendamento: string
    logadouro: string
    nome: string
    valor: string
    map<T>(callbackfn: (value: ReportClientData) => T): T[]
    forEach(callbackfn: (value: ReportClientData, index: number, array: ReportClientData[]) => void): void
}