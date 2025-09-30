import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Carnet } from '../modelli/carnet.model';

@Injectable({
  providedIn: 'root'
})
export class CarnetService {
  private readonly apiUrl = 'http://localhost:3000/api/carnet';

  constructor(private http: HttpClient) {}

  // GET tutti i carnet o con filtri
  getCarnet(filtri?: any): Observable<Carnet[]> {
    let params = new HttpParams();
    
    if (filtri) {
      Object.keys(filtri).forEach(campo => {
        if (filtri[campo] !== null && filtri[campo] !== undefined && filtri[campo] !== '') {
          params = params.set(campo, filtri[campo]);
        }
      });
    }
    
    return this.http.get<Carnet[]>(this.apiUrl, { params });
  }

  // carnet acquistati da un utente
  getCarnetAcquistati(userId: number): Observable<Carnet[]> {
    return this.getCarnet({ proprietario_id: userId });
  }

  // singolo carnet per ID
  getCarnetById(id: number): Observable<Carnet> {
    return this.http.get<Carnet>(`${this.apiUrl}/${id}`);
  }

  // nuovo carnet (acquisto), con solo campi corretti
  acquistaCarnet(carnetData: { proprietario_id: number, num_lezioni: number, data_acquisto: string }): Observable<Carnet> {
    return this.http.post<Carnet>(this.apiUrl, carnetData);
  }

  // modifica carnet (per consumare lezioni)
  aggiornaCarnet(id: number, dati: Partial<Carnet>): Observable<Carnet> {
    return this.http.patch<Carnet>(`${this.apiUrl}/${id}`, dati);
  }

  // elimina carnet
  eliminaCarnet(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // per consumare una lezione da un carnet
  consumaLezione(id: number, lezioniAttuali?: number): Observable<Carnet> {
    if (lezioniAttuali !== undefined && lezioniAttuali > 0) {
      // Se conosciamo già il numero di lezioni, aggiorniamo direttamente
      const nuoveLezioni = lezioniAttuali - 1;
      return this.aggiornaCarnet(id, { num_lezioni: nuoveLezioni });
    }
    // Altrimenti, recuperiamo prima il carnet
    return new Observable(observer => {
      this.getCarnetById(id).subscribe({
        next: (carnet) => {
          //se il carnet ha lezioni
          if (carnet && carnet.num_lezioni && carnet.num_lezioni > 0) {
            const nuoveLezioni = carnet.num_lezioni - 1;
            
            this.aggiornaCarnet(id, { num_lezioni: nuoveLezioni }).subscribe({
              next: (carnetAggiornato) => {
                // restituisce carnet aggiornato
                observer.next(carnetAggiornato);
                observer.complete();
              },
              error: (err) => {
                observer.error(`Errore aggiornamento: ${err}`);
              }
            });
          } else {
            const errorMsg = carnet ? 
              `Nessuna lezione disponibile in questo carnet (lezioni: ${carnet.num_lezioni})` : 
              'Carnet non trovato';
            observer.error(errorMsg);
          }
        },
        error: (err) => {
          observer.error(`Errore recupero: ${err}`);
        }
      });
    });
  }
}
