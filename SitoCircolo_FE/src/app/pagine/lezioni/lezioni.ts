import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
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
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-lezioni',
  templateUrl: './lezioni.html',
  styleUrl: './lezioni.css',
  imports: [FormsModule, Card, MatIconModule, MatButtonModule]
})
export class Lezioni implements OnInit, OnDestroy {

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

  data: string = '';
  ora_inizio: string = '';
  ora_fine: string = '';
  corso_id: number = 0;
  stato: string = '';

  caricamento: boolean = true;  
  errore: string = '';

  ruoloUtente: UserRole | null = null;
  utente: User | null = null;
  private subscription?: Subscription;

  ngOnInit(): void {  
        // Prova il caricamento immediato
        this.caricaDati();

    // Sottoscrizione per aggiornamenti futuri
    this.subscription = this.sessione.user$.subscribe(user => {
      if (user && !this.ruoloUtente) {
          this.caricaDati();
        }
    });
  }

  private caricaDati(): void {
    const currentUser = this.sessione.getLoggedUser();
    const currentRole = this.sessione.getUserRole();

    if (currentUser) {
      this.ruoloUtente = currentRole;
      this.utente = currentUser;
      this.inizializzaPagina();
    } else {
      // Carica comunque la pagina anche senza utente
      this.inizializzaPagina();
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private gestisciErrore(messaggio: string): void {
    this.errore = messaggio;
    this.caricamento = false;
    this.changeDetector.detectChanges();
  }

  private inizializzaPagina(): void {
    this.recuperaCorsi();
    this.caricaLezioni();
  }

  aggiungiStatoIscrizione(lezioni: Lezione[], user: any): void {
    if (!lezioni || !user) return;
    lezioni.forEach(lezione => {
      this.lessonService.controllaPrenotazione(lezione.id, user).subscribe({
        next: (res) => {
          // Aggiungi una proprietà dinamica 'isIscritto' alla lezione
          lezione.isIscritto = res && res.length > 0;
        },
        error: () => {
          lezione.isIscritto = false;
        }
      });
    });
  }

  caricaLezioni(): void {
    this.caricamento = true;
    this.errore = '';
    this.changeDetector.detectChanges();

    const user = this.sessione.getLoggedUser();

    this.lessonService.getLezioni().subscribe({
      next: (lezioni) => {
        this.lezioni = lezioni;
        
        if (user) {
          this.aggiungiStatoIscrizione(this.lezioni, user);
        }
        
        this.applicaFiltri();
        this.caricamento = false;
        this.changeDetector.detectChanges();
        this.aggiornaStatoLezioniCompletate();
      },
      error: (error) => {
        this.gestisciErrore(`Errore nel caricamento delle lezioni: ${error}`);
      }
    });
  };

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
    if (!this.ruoloUtente || this.ruoloUtente !== 'CORSISTA') {
      // Per istruttori e segretari, carica tutti i corsi
      this.courseService.getCorsi().subscribe({
        next: (corsi) => {
          this.corsi = corsi;
          this.changeDetector.detectChanges();
        },
        error: () => this.gestisciErrore("Errore nel caricamento dei corsi")
      });
    } else {
      // Per corsisti, carica solo i corsi a cui sono iscritti
      const user = this.sessione.getLoggedUser();
      if (user) {
        this.userService.getCorsiUtente(user.id).subscribe({
          next: (corsi: Corso[]) => {
            this.corsi = corsi;
            this.changeDetector.detectChanges();
          },
          error: () => this.gestisciErrore("Errore nel caricamento dei corsi")
        });
      } else {
        this.gestisciErrore("Nessun utente trovato per caricare i corsi");
      }
    }
  }

  applicaFiltri(): void {
    this.lezioniFiltrate = this.lezioni.filter(lezione => {
      const matchData = this.matchData(lezione);
      const matchOraInizio = this.matchOraInizio(lezione);
      const matchOraFine = this.matchOraFine(lezione);
      const matchCorso = this.matchCorso(lezione);
      const matchStato = this.matchStato(lezione);
      
      // Filtro specifico per corsisti: mostra solo lezioni dei corsi a cui è iscritto
      const matchCorsiUtente = !this.ruoloUtente || this.ruoloUtente !== 'CORSISTA' || this.corsi.some(corso => corso.id === lezione.corso_id);
      
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
    const dialogRef = this.dialog.open(LezioniDialog, {
      width: '400px',
      data: { }
    });

    // Gestisci la chiusura del dialog
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.caricaLezioni();
      }
    });
  }

  dialogModificaLezione(lezione: Lezione): void {
    const dialogRef = this.dialog.open(LezioniDialog, {
      width: '400px',
      data: { ...lezione }
    });

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
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
      },
      error: (error) => {
        this.messaggio.open(`Errore nell'eliminazione della lezione: ${error}`, 'Chiudi', { 
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
      }
    });
  }

  iscriviti(id: number): void {
    if (!window.confirm(`Sei sicuro di voler iscriverti alla lezione con ID ${id}?`)) {
      return;
    }

    const user = this.sessione.getLoggedUser();
    if (!user) {
      this.messaggio.open('Nessun utente loggato', 'Chiudi', { duration: 3000 });
      return;
    }

    switch (this.ruoloUtente) {
      case 'CORSISTA':
        this.iscriviCorsista(id, user);
        break;
      case 'ISTRUTTORE':
        this.assegnaIstruttore(id, user);
        break;
      case 'SEGRETARIO':
        this.approvaLezione(id, user);
        break;
    }
  }

  private iscriviCorsista(id: number, user: any): void {
    this.carnetService.getCarnetAcquistati(user.id).subscribe({
      next: (carnetAcquistati) => {
        const carnetDisponibili = carnetAcquistati.filter(c => c.num_lezioni > 0);

        if (carnetDisponibili.length === 0) {
          this.messaggio.open('Non hai carnet disponibili con lezioni! Acquistane uno nella sezione Carnet.', 'Chiudi', { duration: 5000 });
          return;
        }

        const carnetDaUsare = carnetDisponibili[0];
        this.lessonService.prenotaLezione(id, user).subscribe({
          next: () => {
            this.carnetService.consumaLezione(carnetDaUsare.id, carnetDaUsare.num_lezioni).subscribe({
              next: () => {
                this.caricaLezioni();
                this.messaggio.open('Iscrizione avvenuta con successo! Una lezione è stata scalata dal tuo carnet.', 'Chiudi', { duration: 3000 });
              },
              error: (error) => {
                this.messaggio.open(`Iscrizione avvenuta ma errore nell'aggiornamento del carnet: ${error}`, 'Chiudi', { duration: 5000 });
              }
            });
          },
          error: (error) => this.messaggio.open(`Errore nell'iscrizione: ${error}`, 'Chiudi', { duration: 5000 })
        });
      },
      error: () => this.messaggio.open('Errore nel controllo dei carnet disponibili.', 'Chiudi', { duration: 5000 })
    });
  }

  private assegnaIstruttore(id: number, user: any): void {
    this.lessonService.modificaLezione(id, { istruttore_id: user.id }).subscribe({
      next: () => {
        this.messaggio.open('Assegnazione avvenuta con successo!', 'Chiudi', { duration: 3000 });
        this.caricaLezioni();
      },
      error: (error) => this.messaggio.open(`Errore nell'assegnazione: ${error}`, 'Chiudi', { duration: 5000 })
    });
  }

  private approvaLezione(id: number, user: any): void {
    this.lessonService.modificaLezione(id, { stato: 'approvata', approvata_da: user.id }).subscribe({
      next: () => {
        this.messaggio.open('Approvazione avvenuta con successo!', 'Chiudi', { duration: 3000 });
        this.caricaLezioni();
      },
      error: (error) => this.messaggio.open(`Errore nell'approvazione: ${error}`, 'Chiudi', { duration: 5000 })
    });
  }
}
