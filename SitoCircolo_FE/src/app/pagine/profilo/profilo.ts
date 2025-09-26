import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { User, UserRole } from '../../modelli/user.model';
import { Sessione } from '../../servizi/sessione';
import { Auth } from '../../servizi/auth';

@Component({
  selector: 'app-profilo',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule
  ],
  templateUrl: './profilo.html',
  styleUrl: './profilo.css'
})
export class Profilo implements OnInit {
  
  user: User | null = null;
  ruolo: UserRole | null = null;
  isLoading: boolean = true;

  constructor(
    private sessione: Sessione,
    private authService: Auth
  ) {};

  ngOnInit() {
    this.loadUserProfile();
  }

  loadUserProfile() {
    // Simula caricamento dati utente
    this.user = this.sessione.getLoggedUser();
    this.ruolo = this.sessione.getUserRole();
    console.log(this.ruolo); 
    this.isLoading = false;
  }



  // Formatta la data per la visualizzazione
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('it-IT');
  }


  

  // Metodi per azioni del profilo
  changePassword() {
    console.log('Cambia password');
    // Qui aprirai il modale per cambiare password
  }

  logout() {
    console.log('Logout');
    this.authService.logout();
  }
}
