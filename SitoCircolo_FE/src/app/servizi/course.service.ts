import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Corso } from '../modelli/course.model';
import { parseCommandLine } from 'typescript';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = 'http://localhost:3000/api/corsi';

  constructor(private http: HttpClient) { }

  
  getCorsi(filtri?: any): Observable<Corso[]> {
    let params = new HttpParams();
    
    if (filtri) {
      Object.keys(filtri).forEach(key => {
        if (filtri[key] !== null && filtri[key] !== undefined && filtri[key] !== '') {
          params = params.set(key, filtri[key]);
        }
      });
    }

    return this.http.get<Corso[]>(this.apiUrl, { params });
  }

  getCorsoById(id: number): Observable<Corso> {
    return this.http.get<Corso>(`${this.apiUrl}/${id}`);
  }

  creaCorso(corso: Corso): Observable<any> {
    return this.http.post(this.apiUrl, corso);
  };

  modificaCorso(id: number, dati: any): Observable<Corso> {
    return this.http.patch<Corso>(`${this.apiUrl}/${id}`, dati);
  }

  eliminaCorso(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getIscrittiCorso(corsoId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${corsoId}/iscritti`);
  }

  IscriviUtenteAlCorso(userId: number, corsoId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${corsoId}/iscritti`, { corsista_id: userId});
  }
}
