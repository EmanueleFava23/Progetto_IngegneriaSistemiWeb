export interface Documento {
    id: number,
    num_documento: string,
    data_rilascio: Date,
    data_scadenza: Date,
    tipologia: string,
    descrizione?: string,
    validato: boolean,
    validatore_id?: number,
    proprietario_id: number
}