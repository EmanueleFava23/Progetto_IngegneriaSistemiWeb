export interface Lezione{
    id: number,
    data: Date,
    ora_inizio?: string,
    ora_fine?: string,
    corso_id: number,
    istruttore_id?: number,
    stato: string,
    proposta_da?: number,
    approvata_da?: number,
    note?: string,
    isIscritto?: boolean
}