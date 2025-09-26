import { Injectable } from '@angular/core';
import { User, UserRole } from '../modelli/user.model';
import { UserService } from './userService';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Sessione {

  private userSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject.asObservable();

  constructor (
    private userService : UserService
  ){
    // Inizializza con l'utente dal localStorage se presente
    const savedUser = this.getLoggedUser();
    if (savedUser) {
      this.userSubject.next(savedUser);
    }
  };

  getLoggedUser(): User | null {
    const raw = localStorage.getItem('utente');
    return raw ? JSON.parse(raw) as User : null;
  };

  setLoggedUser(user: User): void {
    localStorage.setItem('utente', JSON.stringify(user));
    this.userSubject.next(user);
  };

  clearLoggedUser(): void {
    localStorage.removeItem('utente');
    this.userSubject.next(null);
  };

  isLoggedIn(): boolean {
    return this.getLoggedUser() !== null;
  };

  // Nuovi metodi per gestire il ruolo
  getUserRole(): UserRole | null {
    const user = this.getLoggedUser();
    const role = user?.ruolo || null;
    console.log('Sessione - getUserRole():', { user: user?.id, role });
    return role;
  };

  LoadUserRole(): Promise<void> {
    return new Promise((resolve, reject) => {
      const user = this.getLoggedUser();
      if (user && (user.id || (user as any).id)) {
        const userId = user.id || (user as any).id;
        console.log('Caricamento dati utente completi per ID:', userId);
        
        this.userService.getUserById(userId).subscribe({
          next: (updatedUser) => {
            console.log('Dati utente aggiornati ricevuti:', updatedUser);
            // Mantieni i dati esistenti e aggiorna con quelli nuovi (incluso il ruolo)
            const mergedUser = { ...user, ...updatedUser };
            this.setLoggedUser(mergedUser);
            resolve();
          },
          error: (err) => {
            console.warn('Errore nel caricamento dati utente:', err);
            // Mantieni l'utente esistente e risolvi comunque
            resolve();
          }
        });
      } else {
        resolve();
      }
    });
  }


  hasRole(role: UserRole): boolean {
    return this.getUserRole() === role;
  };

  isCorsista(): boolean {
    return this.hasRole('CORSISTA');
  };

  isIstruttore(): boolean {
    return this.hasRole('ISTRUTTORE');
  };

  isSegretario(): boolean {
    return this.hasRole('SEGRETARIO');
  };

  // Metodo per verificare se l'utente ha almeno uno dei ruoli specificati
  hasAnyRole(roles: UserRole[]): boolean {
    const userRole = this.getUserRole();
    return roles.includes(userRole);
  };
}
