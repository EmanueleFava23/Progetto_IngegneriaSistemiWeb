import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Lezione } from '../modelli/lesson.model';
import { User } from '../modelli/user.model';
import { ConstantPool } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class LessonService {
  private apiUrl = 'http://localhost:3000/api/lezioni';

  constructor(
    private http: HttpClient
  ){};

  getLezioni(filtri?: any): Observable<Lezione[]>{
    let params = new HttpParams();

    if (filtri){
      Object.keys(filtri).forEach(campo => {
        if (filtri[campo] !== null && filtri[campo] !== undefined && filtri[campo] !== ''){
          params = params.set(campo, filtri[campo]);
        }
      });
    };

    return this.http.get<Lezione[]>(this.apiUrl, {params});
  };

  getLezionebyId(id: number): Observable<Lezione> {
    return this.http.get<Lezione>(`${this.apiUrl}/${id}`);
  };

  creaLezione(dati: Lezione): Observable<any> {
    return this.http.post(this.apiUrl, dati);
  }
  
  eliminaLezione(id: number): Observable<any>{
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  modificaLezione(id: number, dati: any): Observable<any>{
    return this.http.patch(`${this.apiUrl}/${id}`, dati);
  }

  prenotaLezione(id: number, user: User): Observable<any>{
    console.log(user.id);
    return this.http.post(`${this.apiUrl}/${id}/prenotazione`, {userId: user.id});
  }


  controllaPrenotazione(id: number, user: User): Observable<any>{
    let params = new HttpParams();
    params = params.set('corsista_id', user.id);
    return this.http.get(`${this.apiUrl}/${id}/prenotazione`, {params});
  }
}