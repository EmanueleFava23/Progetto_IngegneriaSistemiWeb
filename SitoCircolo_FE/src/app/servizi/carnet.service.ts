import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Carnet, CarnetTemplate } from '../modelli/carnet.model';

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

  // GET carnet per utente specifico
  getCarnetAcquistati(userId: number): Observable<Carnet[]> {
    return this.getCarnet({ proprietario_id: userId });
  }

  // GET singolo carnet per ID
  getCarnetById(id: number): Observable<Carnet> {
    return this.http.get<Carnet>(`${this.apiUrl}/${id}`);
  }

  // POST nuovo carnet (acquisto) - solo i campi del database
  acquistaCarnet(carnetData: { proprietario_id: number, num_lezioni: number, data_acquisto: string }): Observable<Carnet> {
    return this.http.post<Carnet>(this.apiUrl, carnetData);
  }

  // PATCH modifica carnet (per consumare lezioni)
  aggiornaCarnet(id: number, dati: Partial<Carnet>): Observable<Carnet> {
    return this.http.patch<Carnet>(`${this.apiUrl}/${id}`, dati);
  }

  // DELETE elimina carnet
  eliminaCarnet(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Metodo helper per consumare una lezione da un carnet
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
          if (carnet && carnet.num_lezioni && carnet.num_lezioni > 0) {
            const nuoveLezioni = carnet.num_lezioni - 1;
            
            this.aggiornaCarnet(id, { num_lezioni: nuoveLezioni }).subscribe({
              next: (carnetAggiornato) => {
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
