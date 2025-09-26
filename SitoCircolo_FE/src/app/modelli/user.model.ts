export type UserRole = 'CORSISTA' | 'ISTRUTTORE' | 'SEGRETARIO' | null;

export interface User {
    id: number,
    username: string,
    password: string,
    nome: string,
    cognome: string,
    email: string,
    data_nascita : string,
    telefono?: string,
    cod_fiscale?: string,
    ruolo?: UserRole
}

export interface NuovoUser {
  username: string;
  password: string;
  nome: string;
  cognome: string;
  email: string;
  data_nascita: string;
  telefono?: string;
  cod_fiscale?: string;
  ruolo: UserRole;
}