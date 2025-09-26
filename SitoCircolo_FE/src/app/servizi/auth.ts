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
        let user: User | null;
        if (Array.isArray(response)) {
          user = response.length > 0 ? response[0] : null;
        } else {
          user = response;
        } 
        if (user) {
          if (user.password === password){
            this.sessione.setLoggedUser(user);
            // Attendi che i dati dell'utente siano completamente caricati
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
        console.error('Errore nella registrazione:', err);
        
        // Gestisci errori specifici
        if (err.error && err.error.message) {
          if (err.error.message.includes('Duplicate entry')) {
            this.errore = 'Username già esistente, scegline un altro';
          } else if (err.error.message.includes('data_nascita')) {
            this.errore = 'Data di nascita obbligatoria';
          } else {
            this.errore = 'Errore nella registrazione: ' + err.error.message;
          }
        } else if (err.message) {
          if (err.message.includes('Duplicate entry')) {
            this.errore = 'Username già esistente, scegline un altro';
          } else if (err.message.includes('data_nascita')) {
            this.errore = 'Data di nascita obbligatoria';
          } else {
            this.errore = 'Errore nella registrazione: ' + err.message;
          }
        } else {
          this.errore = 'Errore nella registrazione. Riprova più tardi.';
        }
      }
    });
  };
}
