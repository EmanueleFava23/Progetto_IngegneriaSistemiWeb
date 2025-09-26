import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Sessione } from '../../servizi/sessione';
import { User, UserRole } from '../../modelli/user.model';
import { Lezione } from '../../modelli/lesson.model';
import { LessonService } from '../../servizi/lesson.service';
import { Subscription, interval } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

// Interfaccia per gli eventi

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit, OnDestroy {

  utente: User | null = null;
  ruoloUtente: UserRole | null = null;
  isLoading: boolean = true;
  private subscription?: Subscription;

  
  constructor(
    private sessione: Sessione
  ){};


  ngOnInit(): void {
    // Sottoscrivi agli aggiornamenti dell'utente
    this.subscription = this.sessione.user$.subscribe(user => {
      this.utente = user;
      this.ruoloUtente = user?.ruolo || null;
      
      if (user && this.ruoloUtente) {
        this.isLoading = false;
      } else if (user) {
        // Utente presente ma senza ruolo, aspetta un po'
        setTimeout(() => {
          this.ruoloUtente = this.sessione.getUserRole();
          if (this.ruoloUtente) {
            this.isLoading = false;
          }
        }, 100);
      } else {
        // Nessun utente
        this.isLoading = false;
      }
    });

    // Carica immediatamente se l'utente è già disponibile
    const currentUser = this.sessione.getLoggedUser();
    if (currentUser) {
      this.utente = currentUser;
      this.ruoloUtente = this.sessione.getUserRole();
      if (this.ruoloUtente) {
        this.isLoading = false;
      }
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
