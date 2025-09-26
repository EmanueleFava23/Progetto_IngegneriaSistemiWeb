import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Documento } from '../modelli/document.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private apiUrl = 'http://localhost:3000/api/documenti';

  constructor(
    private http: HttpClient
  ){};

  getDocumenti(filtri?: any): Observable<Documento[]>{
    let params = new HttpParams();

    console.log(filtri);
    if (filtri){
      Object.keys(filtri).forEach(campo => {
        if (filtri[campo] !== null && filtri[campo] !== undefined && filtri[campo] !== ''){
          params = params.set(campo, filtri[campo]);
        }
      });
    };

    return this.http.get<Documento[]>(this.apiUrl, {params})
  }

  getDocumentibyId(id : number): Observable<Documento[]>{
    return this.http.get<Documento[]>(`${this.apiUrl}/${id}`);
  }

  creaDocumento(dati: any): Observable<any> {
    return this.http.post(this.apiUrl, dati);
  }

  eliminaDocumento(id: number): Observable<any>{
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  modificaDocumento(id: number, dati: any): Observable<any>{
    return this.http.patch(`${this.apiUrl}/${id}`, dati);
  };
}
