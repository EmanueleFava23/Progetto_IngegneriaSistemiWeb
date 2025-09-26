import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Corso } from '../../modelli/course.model';
import { CourseService } from '../../servizi/course.service';
import { Router } from '@angular/router';
import { Card } from '../../componenti/card/card';
import { UserRole } from '../../modelli/user.model';
import { Sessione } from '../../servizi/sessione';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { DialogCorso } from './dialog-corso/dialog-corso';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs';


@Component({
  selector: 'app-corsi',
  imports: [CommonModule, FormsModule, Card, MatIconModule, MatButtonModule],
  templateUrl: './corsi.html',
  styleUrl: './corsi.css'
})
export class Corsi implements OnInit {
  
  constructor(
    private courseService : CourseService,
    private router: Router,
    private sessione: Sessione,
    private dialog: MatDialog,
    private messaggio: MatSnackBar,
    private changedector: ChangeDetectorRef
  ) {};

  corsi: Corso[] = [];
  corsiFiltrati: Corso[] = [];
  
  ricerca: string = '';
  livelloSelezionato: string = '';
  dataInizioMin: string = '';
  dataInizioMax: string = '';
  numIscritti: number = 0;

  caricamento: boolean = false;
  errore: string = '';

  ruoloUtente: UserRole | null = null;
  
  livelli: string[] = ['principiante', 'intermedio', 'avanzato'];

  ngOnInit(): void {
    console.log('Corsi ngOnInit - avvio inizializzazione');
    
    // Prova il caricamento immediato
    this.tentaCaricamentoImmediato();
  }

  private tentaCaricamentoImmediato(): void {
    const currentUser = this.sessione.getLoggedUser();
    const currentRole = this.sessione.getUserRole();
    
    console.log('Corsi - tentaCaricamentoImmediato:', { currentUser, currentRole });
    
    // Carica sempre i corsi, indipendentemente dal ruolo
    this.ruoloUtente = currentRole; // Può essere null
    this.caricaCorsi();

    // Fallback assoluto dopo 2 secondi se ancora in caricamento
    setTimeout(() => {
      if (this.caricamento) {
        console.log('Corsi - fallback assoluto dopo 2 secondi');
        this.ruoloUtente = this.sessione.getUserRole(); // Riprova
        this.caricaCorsi();
      }
    }, 2000);
  }


  caricaCorsi(): void {
    console.log('Corsi - caricaCorsi inizio');
    this.caricamento = true;
    this.errore = '';
    this.changedector.detectChanges();

    const user = this.sessione.getLoggedUser();
    console.log('Corsi - user per caricamento:', user?.id);

    this.courseService.getCorsi().subscribe({
      next: (corsi) => {
        console.log('Corsi - corsi caricati:', corsi.length);
        this.corsi = corsi;
        
        if (corsi.length === 0) {
          console.log('Corsi - nessun corso trovato');
          this.corsiFiltrati = [...this.corsi];
          this.caricamento = false;
          this.changedector.detectChanges();
          return;
        }
        
        // Recupera il numero di iscritti e se l'utente è iscritto per ogni corso
        const iscrittiObservables = corsi.map(corso =>
          this.courseService.getIscrittiCorso(corso.id));

        forkJoin(iscrittiObservables).subscribe({
          next: (iscrittiArray) => {
            console.log('Corsi - iscritti caricati per tutti i corsi');
            iscrittiArray.forEach((iscritti, index) => {
              this.corsi[index].num_iscritti = iscritti.length;
              this.corsi[index].iscritti = iscritti;
              if(user){
                this.corsi[index].isIscritto = iscritti.some((i: any) => i.id === user.id);
              } else {
                this.corsi[index].isIscritto = false;
              }
            });
            this.corsiFiltrati = [...this.corsi];
            this.caricamento = false;
            this.changedector.detectChanges();
          },
          error: (error) => {
            console.error('Errore nel recupero degli iscritti:', error);
            // Anche in caso di errore degli iscritti, mostra i corsi base
            this.corsiFiltrati = [...this.corsi];
            this.caricamento = false;
            this.changedector.detectChanges();
          }
        });
      },
      error: (error) => {
        console.error('Errore nel caricamento dei corsi:', error);
        this.errore = 'Errore nel caricamento dei corsi. Riprova più tardi.';
        this.caricamento = false;
        this.changedector.detectChanges();
      }
    });
  }

  applicaFiltri(): void {
    this.corsiFiltrati = this.corsi.filter(corso => {

      const matchRicerca = this.ricerca === '' || 
        corso.nome.toLowerCase().includes(this.ricerca.toLowerCase()) ||
        (corso.descrizione && corso.descrizione.toLowerCase().includes(this.ricerca.toLowerCase()));


      const matchLivello = this.livelloSelezionato === '' || 
        corso.livello === this.livelloSelezionato;


      const matchDataMin = this.dataInizioMin === '' || 
        new Date(corso.data_inizio) >= new Date(this.dataInizioMin);

      const matchDataMax = this.dataInizioMax === '' || 
        new Date(corso.data_inizio) <= new Date(this.dataInizioMax);

      return matchRicerca && matchLivello && matchDataMin && matchDataMax;
    });
  }


  DialogNuovoCorso(): void {
    this.dialog.open(DialogCorso);
  }

  DialogModificaCorso(corso: Corso): void {
    this.dialog.open(DialogCorso, { data: corso });
  }

  resetFiltri(): void {
    this.ricerca = '';
    this.livelloSelezionato = '';
    this.dataInizioMin = '';
    this.dataInizioMax = '';
    this.corsiFiltrati = [...this.corsi];
  }

  getNumeroIscritti(corso: Corso): void{
    this.courseService.getIscrittiCorso(corso.id).subscribe({
      next: (iscritti) => {
        corso.num_iscritti = iscritti.length;
      },
      error: (error) => {
        console.error('Errore nel recupero degli iscritti:', error);
      }
    });
  }

  Iscriviti(corso: Corso): void {
    const user = this.sessione.getLoggedUser();
    if(user){
      if(corso.num_iscritti && corso.max_partecipanti && corso.num_iscritti >= corso.max_partecipanti){
        this.messaggio.open(`Il corso "${corso.nome}" ha raggiunto il numero massimo di partecipanti. Non è possibile iscriversi.`, 'Chiudi', {
          duration: 5000
        });
        return;
      }
      const conferma = window.confirm(`Vuoi davvero iscriverti al corso "${corso.nome}"?`);
      if (!conferma) {
        return;
      }
      this.courseService.IscriviUtenteAlCorso(user.id, corso.id).subscribe({
        next: () => {
          this.messaggio.open(`Iscrizione al corso "${corso.nome}" avvenuta con successo!`, 'Chiudi', {
            duration: 3000
          });
          this.caricaCorsi();
        },
        error: (error) => {
          if (error.status === 409) {
            this.messaggio.open(`Sei già iscritto al corso "${corso.nome}".`, 'Chiudi', {
              duration: 5000
            });
          } else {
            console.error('Errore durante l\'iscrizione:', error);
            this.messaggio.open(`Errore durante l'iscrizione al corso "${corso.nome}". Riprova più tardi.`, 'Chiudi', {
              duration: 5000
            });
          }
        }

      });
    }
  }

  eliminaCorso(corso: Corso): void {

    const conferma = window.confirm(`Sei sicuro di voler eliminare il corso "${corso.nome}"?`);
    
    if (conferma) {
      this.courseService.eliminaCorso(corso.id).subscribe({
        next: () => {
          // Rimuovi il corso dalla lista locale
          if (this.corsi) {
            this.corsi = this.corsi.filter(c => c.id !== corso.id);
            this.corsiFiltrati = this.corsiFiltrati.filter(c => c.id !== corso.id);
          }
          this.messaggio.open(`Corso "${corso.nome}" eliminato con successo!`, 'Chiudi', {
            duration: 3000
          });
          console.log('Corso eliminato con successo');
        },
        error: (error) => {
          console.error('Errore nell\'eliminazione:', error);
        }
      });
    }
  }



}

