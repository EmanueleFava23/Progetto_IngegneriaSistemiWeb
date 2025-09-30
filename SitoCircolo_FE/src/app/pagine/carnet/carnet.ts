import { Component, OnInit } from '@angular/core';
import { Carnet, CarnetTemplate } from "../../modelli/carnet.model";
import { CommonModule } from '@angular/common';
import { Card } from "../../componenti/card/card";
import { CarnetService } from '../../servizi/carnet.service';
import { Sessione } from '../../servizi/sessione';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { User, UserRole } from '../../modelli/user.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-carnet',
  imports: [CommonModule, Card, MatIconModule, MatButtonModule],
  templateUrl: './carnet.html',
  styleUrl: './carnet.css'
})
export class CarnetPage implements OnInit {

  
  //Template per i carnet acquistabili
  carnetDisponibili: CarnetTemplate[] = [
    {
      id: 1,
      num_lezioni: 1,
      tipo_lezioni: 'Lezione singola',
      prezzo: 25,
      descrizione: 'Carnet per una singola lezione.'
    },
    {
      id: 2,
      num_lezioni: 5,
      tipo_lezioni: 'Pacchetto 5 lezioni',
      prezzo: 110,
      descrizione: 'Carnet per 5 lezioni.'
    },
    {
      id: 3,
      num_lezioni: 10,
      tipo_lezioni: 'Pacchetto 10 lezioni',
      prezzo: 200,
      descrizione: 'Carnet per 10 lezioni.'
    }
  ];

  carrello: CarnetTemplate[] = [];
  carnetAcquistati: Carnet[] = [];

  // Controllo accesso
  ruoloUtente: UserRole | null = null;
  utente: User | null = null;

  constructor(
    private carnetService: CarnetService,
    private sessione: Sessione,
    private messaggio: MatSnackBar
  ) {}



  ngOnInit(): void {
    this.ruoloUtente = this.sessione.getUserRole();
    this.utente = this.sessione.getLoggedUser();

    // Carica i carnet acquistati
    this.aggiornaCarnetAcquistati();
  }

  aggiornaCarnetAcquistati() {
    if (!this.utente) {
      this.carnetAcquistati = [];
      return;
    }

    this.carnetService.getCarnetAcquistati(this.utente.id).subscribe({
      next: (listaCarnet) => {
        this.carnetAcquistati = listaCarnet;
      },
      error: (error) => {
        console.error('Errore nel recupero dei carnet:', error);
        this.carnetAcquistati = [];
      }
    });
  }

  // Metodo per ricaricare i carnet
  ricaricaCarnet(): void {
    this.aggiornaCarnetAcquistati();
  }

  // Calcola il totale del carrello
  getTotaleCarrello(): number {
    return this.carrello.reduce((totale, carnet) => totale + carnet.prezzo, 0);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT');
  }

  aggiungiAlCarrello(carnet: CarnetTemplate) {
    this.carrello.push({...carnet});
  }

  rimuoviDalCarrello(idx: number) {
    this.carrello.splice(idx, 1);
  }

  acquistaCarrello() {
    if (!confirm('Sei sicuro di voler completare l\'acquisto per un totale di €' + this.getTotaleCarrello() + '?')) {
      return;
    }
    if (!this.utente) {
      alert('Devi essere loggato per acquistare!');
      return;
    }
    
    if (this.carrello.length === 0) {
      alert('Il carrello è vuoto!');
      return;
    }
    
    let acquisti = 0;
    let errori = 0;

    //per controllare quando ho finito tutti gli acquisti
    const totaleAcquisti = this.carrello.length;

    //creo un carnet per ogni elemento del carrello
    this.carrello.forEach(c => {
      //creo entità carnet da inviare
      const nuovoCarnet = {
        proprietario_id: this.utente!.id,
        data_acquisto: new Date().toISOString().split('T')[0], //formato YYYY-MM-DD
        num_lezioni: c.num_lezioni
      };

      this.carnetService.acquistaCarnet(nuovoCarnet).subscribe({
        next: () => {
          acquisti++;
          if (acquisti + errori === totaleAcquisti) {
            this.carrello = [];
            this.aggiornaCarnetAcquistati();
            if (errori === 0) {
              this.messaggio.open('Acquisto completato con successo!', 'Chiudi', { 
                duration: 3000,
                verticalPosition: 'top'
              });
            } else {
              this.messaggio.open(`Acquisto parzialmente completato. ${errori} carnet non sono stati acquistati.`, 'Chiudi', { 
                duration: 3000,
                verticalPosition: 'top'
              });
            }
          }
        },
        error: (error) => {
          errori++;
          console.error('Errore nell acquisto:', error);
          if (acquisti + errori === totaleAcquisti) {
            if (acquisti > 0) {
              this.carrello = [];
              this.aggiornaCarnetAcquistati();
              this.messaggio.open(`Acquisto parzialmente completato. ${errori} carnet non sono stati acquistati.`, 'Chiudi', { 
                duration: 3000,
                verticalPosition: 'top'
              });
            } else {
              this.messaggio.open('Errore durante l\'acquisto!', 'Chiudi', { 
                duration: 3000,
                verticalPosition: 'top'
              });
            }
          }
        }
      });
    });
  }


  consumaLezioneSuCarnet(carnetId: number) {
    this.carnetService.consumaLezione(carnetId).subscribe({
      next: (carnetAggiornato) => {
        this.aggiornaCarnetAcquistati();
      },
      error: (error) => {
        console.error('Errore nel consumo della lezione:', error);
        alert('Errore nel consumo della lezione!');
      }
    });
  }
}
