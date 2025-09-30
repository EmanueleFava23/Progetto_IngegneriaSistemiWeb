import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LessonService } from '../../servizi/lesson.service';
import { Lezione } from '../../modelli/lesson.model';
import { CourseService } from '../../servizi/course.service';
import { FormsModule } from '@angular/forms';
import { Card } from "../../componenti/card/card";
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { LezioniDialog } from './lezioni-dialog/lezioni-dialog';
import { MatDialog } from '@angular/material/dialog';
import { Corso } from '../../modelli/course.model';
import { Sessione } from '../../servizi/sessione';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User, UserRole } from '../../modelli/user.model';
import { UserService } from '../../servizi/userService';
import { CarnetService } from '../../servizi/carnet.service';




@Component({
  selector: 'app-lezioni',
  templateUrl: './lezioni.html',
  styleUrl: './lezioni.css',
  imports: [FormsModule, Card, MatIconModule, MatButtonModule]
})
export class Lezioni implements OnInit {

  constructor(
    private lessonService: LessonService,
    private courseService: CourseService,
    private userService: UserService,
    private dialog: MatDialog,
    private sessione: Sessione,
    private messaggio: MatSnackBar,
    private carnetService: CarnetService,
    private changeDetector: ChangeDetectorRef
  ){};

  lezioni: Lezione[] = [];
  lezioniFiltrate: Lezione[] = [];
  corsi: Corso[] = [];
  utenti: User[] = [];

  data: string = '';
  ora_inizio: string = '';
  ora_fine: string = '';
  corso_id: number = 0;
  stato: string = '';

  caricamento: boolean = true;  
  errore: string = '';

  ruoloUtente!: UserRole;
  utente!: User;

  ngOnInit(): void {
    this.ruoloUtente = this.sessione.getUserRole()!;
    this.utente = this.sessione.getLoggedUser()!;

    this.recuperaCorsi();
    this.caricaUtenti();
    this.caricaLezioni();
  }




  caricaLezioni(): void {
    this.caricamento = true;
    this.errore = '';
    this.changeDetector.detectChanges();

    this.lessonService.getLezioni().subscribe({
      next: (lezioni) => {
        this.lezioni = lezioni;
        // Prima imposta tutti come non iscritti
        this.lezioni.forEach(l => l.isIscritto = false);
        this.applicaFiltri();
        // Poi verifica le prenotazioni 
        this.verificaPrenotazioni();
        this.caricamento = false;
        this.changeDetector.detectChanges();
        this.aggiornaStatoLezioniCompletate();
      },
      error: (error) => {
        this.gestisciErrore(`Errore nel caricamento delle lezioni: ${error}`);
      }
    });
  }

  caricaUtenti(): void {
    this.userService.getAllUsers().subscribe({
      next: (utenti) => {
        this.utenti = utenti;
        this.changeDetector.detectChanges();
      },
      error: () => {
        console.error("Errore nel caricamento degli utenti");
      }
    });
  }

  verificaPrenotazioni(): void {
    if (!this.utente) return;

    this.lezioni.forEach(lezione => {
      this.lessonService.controllaPrenotazione(lezione.id, this.utente).subscribe({
        next: (risultato) => {
          lezione.isIscritto = risultato.isIscritto || risultato.prenotato || risultato.length > 0 || false;
          this.changeDetector.detectChanges();
        },
        error: () => {
          lezione.isIscritto = false;
        }
      });
    });
  }



  aggiornaStatoLezioniCompletate(): void {
    const oggi = new Date();
    this.lezioni.forEach(lezione => {

      // Confronta solo la data, non l'orario
      const dataLezione = new Date(lezione.data);
      if (dataLezione < oggi && lezione.stato !== 'completata') {
        // Aggiorna lo stato solo se non è già completata
        this.lessonService.modificaLezione(lezione.id, { stato: 'completata' }).subscribe({
          next: () => {
            lezione.stato = 'completata';
          },
          error: (err) => {
            console.error(`Errore nell'aggiornamento della lezione ${lezione.id}:`, err);
          }
        });
      }
    });
  }

  recuperaCorsi(): void {
    if (this.ruoloUtente === 'CORSISTA') {
      // Per corsisti, carica solo i corsi a cui sono iscritti
      this.userService.getCorsiUtente(this.utente!.id).subscribe({
        next: (corsi: Corso[]) => {
          this.corsi = corsi;
          this.changeDetector.detectChanges();
        },
        error: () => this.gestisciErrore("Errore nel caricamento dei corsi")
      });
    } else {
      // Per istruttori e segretari, carica tutti i corsi
      this.courseService.getCorsi().subscribe({
        next: (corsi) => {
          this.corsi = corsi;
          this.changeDetector.detectChanges();
        },
        error: () => this.gestisciErrore("Errore nel caricamento dei corsi")
      });
    }
  }

  applicaFiltri(): void {
    this.lezioniFiltrate = this.lezioni.filter(lezione => {
      const matchData = this.matchData(lezione);
      const matchOraInizio = this.matchOraInizio(lezione);
      const matchOraFine = this.matchOraFine(lezione);
      const matchCorso = this.matchCorso(lezione);
      const matchStato = this.matchStato(lezione);
      const matchCorsiUtente = this.matchCorsiUtente(lezione);
      
      return matchData && matchOraInizio && matchOraFine && matchCorso && matchStato && matchCorsiUtente;
    });
  }

  private matchData(lezione: Lezione): boolean {
    return this.data === '' ||
      (this.formattaData(lezione.data) === this.formattaData(this.data));
  }

  private matchOraInizio(lezione: Lezione): boolean {
    return this.ora_inizio === '' ||
      ((typeof lezione.ora_inizio === 'string') && lezione.ora_inizio >= this.ora_inizio);
  }

  private matchOraFine(lezione: Lezione): boolean {
    return this.ora_fine === '' ||
      ((typeof lezione.ora_fine === 'string') && lezione.ora_fine <= this.ora_fine);
  }

  private matchCorso(lezione: Lezione): boolean {
    return this.corso_id == 0 ||
      lezione.corso_id == this.corso_id;
  }

  private matchStato(lezione: Lezione): boolean {
    return this.stato === '' || lezione.stato === this.stato;
  }

  private matchCorsiUtente(lezione: Lezione): boolean {
    // mostra solo lezioni dei corsi a cui è iscritto un CORSISTA
    return this.ruoloUtente !== 'CORSISTA' || this.corsi.some(corso => corso.id === lezione.corso_id);
  }

  resetFiltri(): void{
    this.data = '';
    this.ora_inizio = '';
    this.ora_fine = '';
    this.corso_id = 0;
    this.stato = '';
    this.lezioniFiltrate = [...this.lezioni];
  }

  formattaData(data: any): string {
    return new Date(data).toLocaleDateString('it-IT');
  }


  dialogNuovaLezione(): void {
    // Apri il dialog per creare una nuova lezione
    const dialogRef = this.dialog.open(LezioniDialog);

    // Gestisci la chiusura del dialog
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.caricaLezioni();
      }
    });
  }

  dialogModificaLezione(lezione: Lezione): void {
    const dialogRef = this.dialog.open(LezioniDialog, { data: { ...lezione } });

    // Gestisci la chiusura del dialog
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.caricaLezioni();
      }
    });
  }

  eliminaLezione(id: number): void {
    if (!window.confirm(`Sei sicuro di voler eliminare la lezione con ID ${id}?`)) {
      return;
    }
    
    this.lessonService.eliminaLezione(id).subscribe({
      next: () => {
        this.caricaLezioni();
        this.messaggio.open('Lezione eliminata con successo!', 'Chiudi', { 
          duration: 3000,
          verticalPosition: 'top'
        });
      },
      error: (error) => {
        this.messaggio.open(`Errore nell'eliminazione della lezione: ${error}`, 'Chiudi', { 
          duration: 5000,
          verticalPosition: 'top'
        });
      }
    });
  }

  iscriviti(id: number): void {
    if (!window.confirm(`Sei sicuro di voler iscriverti alla lezione con ID ${id}?`)) {
      return;
    }

    switch (this.ruoloUtente) {
      case 'CORSISTA':
        this.iscriviCorsista(id, this.utente!);
        break;
      case 'ISTRUTTORE':
        this.assegnaIstruttore(id, this.utente!);
        break;
      case 'SEGRETARIO':
        this.approvaLezione(id, this.utente!);
        break;
    }
  }

  iscriviCorsista(id: number, user: any): void {
    this.carnetService.getCarnetAcquistati(user.id).subscribe({
      next: (carnetAcquistati) => {
        // Filtra i carnet con lezioni disponibili
        const carnetDisponibili = carnetAcquistati.filter(c => c.num_lezioni > 0);
        
        if (carnetDisponibili.length === 0) {
          this.messaggio.open('Non hai carnet disponibili con lezioni! Acquistane uno nella sezione Carnet.', 'Chiudi', {
          duration: 3000,
          verticalPosition: 'top'
        });
          return;
        }
        // Usa il primo carnet disponibile
        const carnetDaUsare = carnetDisponibili[0];
        this.lessonService.prenotaLezione(id, user).subscribe({
          next: () => {
            this.carnetService.consumaLezione(carnetDaUsare.id, carnetDaUsare.num_lezioni).subscribe({
              next: () => {
                this.caricaLezioni();
                this.messaggio.open('Iscrizione avvenuta con successo! Una lezione è stata scalata dal tuo carnet.', 'Chiudi', {
                  duration: 3000,
                  verticalPosition: 'top'
                });
              },
              error: (error) => {
                this.messaggio.open(`Iscrizione avvenuta ma errore nell'aggiornamento del carnet: ${error}`, 'Chiudi', {
                  duration: 5000,
                  verticalPosition: 'top'
                });
              }
            });
          },
          error: (error) => {
            this.messaggio.open(`Errore nell'iscrizione: ${error}`, 'Chiudi', {
              duration: 5000,
              verticalPosition: 'top'
            });
          }
        });
      },
      error: () => {
        this.messaggio.open('Errore nel controllo dei carnet disponibili.', 'Chiudi', {
          duration: 5000,
          verticalPosition: 'top'
        });
      }
    });
  }

  private assegnaIstruttore(id: number, user: any): void {
    this.lessonService.modificaLezione(id, { istruttore_id: user.id }).subscribe({
      next: () => {
        this.messaggio.open('Assegnazione avvenuta con successo!', 'Chiudi', {
          duration: 3000,
          verticalPosition: 'top'
        });
        this.caricaLezioni();
      },
      error: (error) => {
        this.messaggio.open(`Errore nell'assegnazione: ${error}`, 'Chiudi', {
          duration: 3000,
          verticalPosition: 'top'
        });
      }
    });
  }

  private approvaLezione(id: number, user: any): void {
    this.lessonService.modificaLezione(id, { stato: 'approvata', approvata_da: user.id }).subscribe({
      next: () => {
        this.messaggio.open('Approvazione avvenuta con successo!', 'Chiudi', {
          duration: 3000,
          verticalPosition: 'top'
        });
        this.caricaLezioni();
      },
      error: (error) => {
        this.messaggio.open(`Errore nell'approvazione: ${error}`, 'Chiudi', {
          duration: 3000,
          verticalPosition: 'top'
        });
      }
    });
  }

  private gestisciErrore(messaggio: string): void {
  this.errore = messaggio;
  this.caricamento = false;
  this.changeDetector.detectChanges();
  }
}
