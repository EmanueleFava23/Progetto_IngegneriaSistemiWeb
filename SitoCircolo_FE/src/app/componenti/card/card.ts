import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatCard, MatCardTitle,MatCardActions } from '@angular/material/card';
import { MatCardContent } from '@angular/material/card';
import { Input } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CourseService } from '../../servizi/course.service';
import { User, UserRole } from '../../modelli/user.model';
import { Sessione } from '../../servizi/sessione';
import { Corso } from '../../modelli/course.model';

@Component({
  selector: 'app-card',
  imports: [MatCard,  MatCardContent, MatCardTitle, MatCardActions, MatIconModule],
  templateUrl: './card.html',
  styleUrl: './card.css'
})
export class Card implements OnInit{

  @Input() dati!: any;
  @Input() tipo!: "corso" | "carnet" | "documento" | "lezione";
  @Input() corsi: Corso[] = [];
  @Input() utenti: User[] = [];

  @Output() Modifica = new EventEmitter<any>();
  @Output() Elimina = new EventEmitter<any>();
  @Output() Iscriviti = new EventEmitter<any>();

  ruoloUtente!: UserRole;

  constructor(
    private sessione: Sessione
  ){};

  ngOnInit(): void {
    this.ruoloUtente = this.sessione.getUserRole();
  }

  formattaData(data: string): string {
    return new Date(data).toLocaleDateString('it-IT');
  }


  getNomeCorso(id: number): string {
    if (!this.corsi || this.corsi.length === 0) {
      return 'Caricamento';
    }
    
    const corso = this.corsi.find(c => c.id === id);
    return corso ? corso.nome : 'Corso non trovato';
  }

  getNomeIstruttore(id: number): string {
    if (!this.utenti || this.utenti.length === 0) {
      return 'Caricamento';
    }
    
    const istruttore = this.utenti.find(u => u.id === id);
    return istruttore ? `${istruttore.nome} ${istruttore.cognome}` : 'Istruttore non trovato';
  };

  getNomeSegretario(id: number): string{
    if (!this.utenti || this.utenti.length === 0) {
      return 'Caricamento';
    }
    
    const segretario = this.utenti.find(u => u.id === id);
    return segretario ? `${segretario.nome} ${segretario.cognome}` : 'Segretario non trovato';
  }

  getNomeCorsista(id: number): string{
    if (!this.utenti || this.utenti.length === 0) {
      return 'Caricamento';
    }
    
    const corsista = this.utenti.find(u => u.id === id);
    return corsista ? `${corsista.nome} ${corsista.cognome}` : 'Corsista non trovato';
  }
}
