// Carnet come salvato nel database
export interface Carnet{
    id: number,
    proprietario_id: number,
    data_acquisto: string,
    num_lezioni: number,
}

// Template carnet per il frontend (non salvati nel DB)
export interface CarnetTemplate{
    id: number,
    num_lezioni: number,
    tipo_lezioni: string,
    prezzo: number,
    descrizione: string,
}