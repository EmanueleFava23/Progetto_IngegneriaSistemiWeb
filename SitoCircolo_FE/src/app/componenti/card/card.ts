import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatCard, MatCardHeader,MatCardTitle,MatCardActions } from '@angular/material/card';
import { MatCardContent } from '@angular/material/card';
import { Documento } from '../../modelli/document.model';
import { Input } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatCardSubtitle, MatCardFooter } from '@angular/material/card';
import { CourseService } from '../../servizi/course.service';
import { UserService } from '../../servizi/userService';
import { User, UserRole } from '../../modelli/user.model';
import { Sessione } from '../../servizi/sessione';
import { LessonService } from '../../servizi/lesson.service';

@Component({
  selector: 'app-card',
  imports: [MatCard,  MatCardContent, MatCardTitle, MatCardActions, MatIconModule],
  templateUrl: './card.html',
  styleUrl: './card.css'
})
export class Card implements OnInit{

  @Input() dati!: any;
  @Input() tipo!: "corso" | "carnet" | "documento" | "lezione";

  @Output() Modifica = new EventEmitter<any>();
  @Output() Elimina = new EventEmitter<any>();
  @Output() Iscriviti = new EventEmitter<any>();

  ruoloUtente!: UserRole;

  constructor(
    private router: Router,
    private courseService: CourseService,
    private userService: UserService,
    private sessione: Sessione
  ){};

  ngOnInit(): void {
    this.ruoloUtente = this.sessione.getUserRole();
  }

  formattaData(data: string): string {
    return new Date(data).toLocaleDateString('it-IT');
  }

    //cosi evito loop infiniti
  private corsiCache = new Map<number, string>();
  private utentiCache = new Map<number, string>();

  getNomeCorso(id: number): string{
    if (this.corsiCache.has(id)) {
      return this.corsiCache.get(id)!;
    }

    // Inizializza con un valore, per visualizzazione
    this.corsiCache.set(id, 'Caricamento...');
    
    this.courseService.getCorsoById(id).subscribe({
      next: (corso: any) => {
        this.corsiCache.set(id, corso[0].nome);
      },
      error: (err) => {
        this.corsiCache.set(id, `ERRORE: ${err}`);
      }
    });
    
    return this.corsiCache.get(id)!;
  };

  getNomeIstruttore(id: number): string{

    if (this.utentiCache.has(id)) {
      return this.utentiCache.get(id)!;
    }

    this.utentiCache.set(id, '');

    this.userService.getUserById(id).subscribe({
      next: (istru: User) => {
        if(istru){
          this.utentiCache.set(id, istru.nome);
        }
      },
      error: (err)=> {
        this.utentiCache.set(id, `ERRORE: ${err}`);
      }
    });

    return this.utentiCache.get(id)!;
  };

  getNomeSegretario(id: number): string{
    let nomecompleto : string;

    if (this.utentiCache.has(id)) {
      return this.utentiCache.get(id)!;
    }

    this.utentiCache.set(id, '');

    this.userService.getUserById(id).subscribe({
      next: (seg: User) => {
        if(seg){
          nomecompleto = seg.nome + ' ' + seg.cognome;
          this.utentiCache.set(id, nomecompleto);
        }
      },
      error: (err)=> {
        this.utentiCache.set(id, `ERRORE: ${err}`);
      }

    });

    return this.utentiCache.get(id)!;
  }

  getNomeCorsista(id: number): string{
    console.log("ricerca nome");
    let nomecompleto : string;

    if (this.utentiCache.has(id)) {
      return this.utentiCache.get(id)!;
    }

    this.utentiCache.set(id, '');

    this.userService.getUserById(id).subscribe({
      next: (cors: User) => {
        if(cors){
          console.log(cors.nome);
          nomecompleto = cors.nome + ' ' + cors.cognome;
          this.utentiCache.set(id, nomecompleto);
        }
      },
      error: (err)=> {
        this.utentiCache.set(id, `ERRORE: ${err}`);
      }

    });

    return this.utentiCache.get(id)!;
  }
}
