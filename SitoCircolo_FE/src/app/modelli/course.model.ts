import { NumericLiteral } from "typescript"

export interface Corso{
    id: number,
    nome: string,
    livello: string,
    data_inizio: string,
    data_fine: string,
    descrizione?: string,
    num_iscritti?: number,
    max_partecipanti?: number,
    creato_da: number,
    isIscritto?: boolean,
    iscritti?: any[]
}