import { Injectable } from '@angular/core';
import { User, UserRole } from '../modelli/user.model';
import { UserService } from './userService';

@Injectable({
  providedIn: 'root'
})
export class Sessione {

  constructor (
    private userService : UserService
  ){};

  getLoggedUser(): User | null {
    const raw = localStorage.getItem('utente');
    return raw ? JSON.parse(raw) as User : null;
  };

  setLoggedUser(user: User): void {
    localStorage.setItem('utente', JSON.stringify(user));
  };

  clearLoggedUser(): void {
    localStorage.removeItem('utente');
  };

  isLoggedIn(): boolean {
    return this.getLoggedUser() !== null;
  };

  // metodi per gestire il ruolo
  getUserRole(): UserRole | null {
    const user = this.getLoggedUser();
    return user?.ruolo || null;
  };

  LoadUserRole(): Promise<void> {
    return new Promise((resolve) => {
      const user = this.getLoggedUser();
      if (user && (user.id )) {
        const userId = user.id;

        this.userService.getUserById(userId).subscribe({
          next: (updatedUser) => {
            // Mantieni i dati esistenti e aggiorna con quelli nuovi (incluso il ruolo)
            const mergedUser = { ...user, ...updatedUser };
            this.setLoggedUser(mergedUser);
            resolve();
          },
          error: () => {
            // Mantieni l'utente esistente e risolvi comunque
            resolve();
          }
        });
      } else {
        resolve();
      }
    });
  }

}
