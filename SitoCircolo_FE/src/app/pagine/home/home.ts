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
export class Home implements OnInit{

  utente: User | null = null;
  ruoloUtente: UserRole | null = null;
  isLoading: boolean = true;

  
  constructor(
    private sessione: Sessione
  ){};


  ngOnInit(): void {

    const currentUser = this.sessione.getLoggedUser();
    if (currentUser) {
      this.utente = currentUser;
      this.ruoloUtente = this.sessione.getUserRole();
      if (this.ruoloUtente) {
        this.isLoading = false;
      }
    }
  }

}
