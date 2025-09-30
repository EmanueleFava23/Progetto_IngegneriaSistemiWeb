import { Injectable } from '@angular/core';
import { Sessione } from './sessione';
import { UserService } from './userService';
import { Router } from '@angular/router';
import { NuovoUser, User } from '../modelli/user.model';

@Injectable({
  providedIn: 'root'
})
export class Auth {

  errore = '';

  constructor(
    private sessione : Sessione,
    private userService: UserService,
    private router: Router
  ){};
  
  login(username: string, password: string): void {
    
    this.errore = '';
    this.userService.getUserByUsername(username).subscribe({
      next: (response: User | null) => {
        
        // Gestisci il caso in cui il UserService restituisce ancora un array
        let user: User | null  = response;

        if (user) {
          if (user.password === password){
            this.sessione.setLoggedUser(user);
            this.sessione.LoadUserRole().then(() => {
              this.router.navigate(['/home']);
            });
          } else {
            this.errore = 'Password errata';
          }
        }
        else {
          this.errore = 'Utente non trovato';
        }
      },
      error: (err) => {
        this.errore = 'Utente non trovato';
      }
    })
  };

  logout(): void{
    this.sessione.clearLoggedUser();
    this.router.navigate(['/login']);
  };

  register(user: NuovoUser): void{;

    this.errore = '';
    this.userService.createUser(user).subscribe({
      next: () =>{
    
        // Aggiungi un piccolo delay per dare tempo al backend di processare
        setTimeout(() => {
          this.login(user.username, user.password);
        }, 500);
      },
      error: (err) => {
        
        // Gestisci errori specifici
        if (err.error && err.error.message) {
            this.errore = 'Errore nella registrazione: ' + err.error.message;
      }
    }
    });
  };
}
