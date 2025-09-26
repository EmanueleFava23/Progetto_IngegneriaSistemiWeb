import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NuovoUser, User } from '../modelli/user.model';
import { Corso } from '../modelli/course.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersUrl = 'http://localhost:3000/api/utenti';

  constructor(
    private http: HttpClient
  ){};

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.usersUrl}`);
  }

  getUserById(userId: number): Observable<User>{
    return this.http.get<User>(`${this.usersUrl}/${userId}`);
  }


  //funziona
  getUserByUsername(username: string): Observable<User | null>{
    const params = new HttpParams().set('username', username);
    return this.http.get<User[]>(this.usersUrl, { params }).pipe(
      map((users: User[]) => users && users.length > 0 ? users[0] : null)
    );
  }

  createUser(user: NuovoUser): Observable<any> {
    return this.http.post(this.usersUrl, user);
  }

  getCorsiUtente(userId: number): Observable<Corso[]> {
    return this.http.get<Corso[]>(`http://localhost:3000/api/utenti/${userId}/corsi`);
  }

};
