import { ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Corso } from '../../modelli/course.model';
import { CourseService } from '../../servizi/course.service';
import { Card } from '../../componenti/card/card';
import { User, UserRole } from '../../modelli/user.model';
import { Sessione } from '../../servizi/sessione';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { DialogCorso } from './dialog-corso/dialog-corso';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs';
import { UserService } from '../../servizi/userService';


@Component({
  selector: 'app-corsi',
  imports: [CommonModule, FormsModule, Card, MatIconModule, MatButtonModule],
  templateUrl: './corsi.html',
  styleUrl: './corsi.css'
})
export class Corsi implements OnInit {
  
  constructor(
    private courseService : CourseService,
    private sessione: Sessione,
    private dialog: MatDialog,
    private messaggio: MatSnackBar,
    private changedector: ChangeDetectorRef,
    private userService: UserService
  ) {};

  corsi: Corso[] = [];
  corsiFiltrati: Corso[] = [];
  utenti: User[] = [];
  
  ricerca: string = '';
  livelloSelezionato: string = '';
  dataInizio: string = '';
  dataFine: string = '';
  numIscritti: number = 0;

  caricamento: boolean = false;
  errore: string = '';

  ruoloUtente: UserRole | null = null;
  user : User | null = null;
  
  livelli: string[] = ['principiante', 'intermedio', 'avanzato'];

  ngOnInit(): void {
    
    this.user = this.sessione.getLoggedUser();
    this.ruoloUtente = this.sessione.getUserRole();

    this.caricaUtenti();
    this.caricaCorsi();
  }

  caricaUtenti(): void {
    this.userService.getAllUsers().subscribe({
      next: (utenti) => {
        this.utenti = utenti;
        this.changedector.detectChanges();
      },
      error: () => {
        console.error("Errore nel caricamento degli utenti");
      }
    });
  }



  caricaCorsi(): void {
    this.caricamento = true;
    this.errore = '';
    this.changedector.detectChanges();

    const user = this.sessione.getLoggedUser();
   

    this.courseService.getCorsi().subscribe({
      next: (corsi) => {
        this.corsi = corsi;
        
        if (corsi.length === 0) {
          this.corsiFiltrati = [...this.corsi];
          this.caricamento = false;
          this.changedector.detectChanges();
          return;
        }
        
        // Crea un array di Observable per ottenere gli iscritti di ogni corso
        const iscrittiObservables = corsi.map(corso =>
          this.courseService.getIscrittiCorso(corso.id));
        
        // Usa forkJoin per attendere che tutte le chiamate siano completate
        forkJoin(iscrittiObservables).subscribe({
          next: (iscrittiArray) => {
            // Aggiorna ogni corso con il numero di iscritti e lo stato di iscrizione
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
          error: () => {
            // Anche in caso di errore degli iscritti, mostra i corsi base
            this.corsiFiltrati = [...this.corsi];
            this.caricamento = false;
            this.changedector.detectChanges();
          }
        });
      },
      error: () => {
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


      const matchDataMin = this.dataInizio === '' || 
        new Date(corso.data_inizio) >= new Date(this.dataInizio);

      const matchDataMax = this.dataFine === '' || 
        new Date(corso.data_fine) <= new Date(this.dataFine);

      return matchRicerca && matchLivello && matchDataMin && matchDataMax;
    });
  }

  resetFiltri(): void {
    this.ricerca = '';
    this.livelloSelezionato = '';
    this.dataInizio = '';
    this.dataFine = '';
    this.corsiFiltrati = [...this.corsi];
  }



  DialogNuovoCorso(): void {
    this.dialog.open(DialogCorso);
  }

  DialogModificaCorso(corso: Corso): void {
    this.dialog.open(DialogCorso, { data: corso });
  }


  Iscriviti(corso: Corso): void {
    if(this.user){
      // Controlla se i posti sono finiti
      if(corso.num_iscritti && corso.max_partecipanti && corso.num_iscritti >= corso.max_partecipanti){
        this.messaggio.open(`Il corso "${corso.nome}" ha raggiunto il numero massimo di partecipanti. Non è possibile iscriversi.`, 'Chiudi', {
          duration: 3000,
          verticalPosition: 'top'
        });
        return;
      }
      const conferma = window.confirm(`Vuoi davvero iscriverti al corso "${corso.nome}"?`);
      if (!conferma) {
        return;
      }
      //se confermato procedi con l'iscrizione
      this.courseService.IscriviUtenteAlCorso(this.user.id, corso.id).subscribe({
        next: () => {
          this.messaggio.open(`Iscrizione al corso "${corso.nome}" avvenuta con successo!`, 'Chiudi', {
            duration: 3000,
            verticalPosition: 'top'
          });
          //ricarica i corsi per aggiornare il numero di iscritti
          this.caricaCorsi();
        },
        error: (error) => {
          if (error.status === 409) {
            this.messaggio.open(`Sei già iscritto al corso "${corso.nome}".`, 'Chiudi', {
              duration: 3000,
              verticalPosition: 'top'
            });
          } else {
            console.error('Errore durante l\'iscrizione:', error);
            this.messaggio.open(`Errore durante l'iscrizione al corso "${corso.nome}". Riprova più tardi.`, 'Chiudi', {
              duration: 3000,
              verticalPosition: 'top'
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
            duration: 3000,
            verticalPosition: 'top'
          });
        }
      });
    }
  }



}

