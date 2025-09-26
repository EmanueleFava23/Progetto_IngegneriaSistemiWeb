import { Component, OnInit } from '@angular/core';
import { Card } from "../../componenti/card/card";
import { DocumentService } from '../../servizi/document.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AggiungiDocumentoDialog } from './aggiungi-documento-dialog/aggiungi-documento-dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Sessione } from '../../servizi/sessione';
import { User, UserRole } from '../../modelli/user.model';
import { Documento } from '../../modelli/document.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-documenti',
  imports: [Card, MatDialogModule, MatButtonModule, MatIcon],
  templateUrl: './documenti.html',
  styleUrl: './documenti.css'
})
export class Documenti implements OnInit {

  user: User | null = null;
  documenti : Documento[] | null = null;

  ruoloUtente! : UserRole;

  ngOnInit(): void {
    this.ruoloUtente = this.sessione.getUserRole();
    if(this.ruoloUtente === 'SEGRETARIO'){
      this.getTuttiDocumenti();
    }
    else{
      this.getDocumentiUtente();
    }
  }

  constructor(
    private dialog: MatDialog,
    private docService: DocumentService,
    private sessione: Sessione,
    private messaggio: MatSnackBar
  ){};

  DialogNuovoDocumento(){
    const dialogRef = this.dialog.open(AggiungiDocumentoDialog);

    // Chiusura dialor per ricarica documenti
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        
        this.ricaricaDocumenti();
      }
    });
  }

  DialogModificaDocumento(doc: Documento){
    const dialogRef = this.dialog.open(AggiungiDocumentoDialog, { data: doc });

    // Gestisci la chiusura del dialog
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.ricaricaDocumenti();
      }
    });
  }

  EliminaDocumento(doc: Documento){

    const conferma = window.confirm(`Sei sicuro di voler eliminare il documento "${doc.tipologia}" n° ${doc.num_documento}?`);
    
    if (conferma) {
      this.docService.eliminaDocumento(doc.id).subscribe({
        next: () => {
          // Ricarica la pagina per aggiornare tutti i dati
          this.ricaricaDocumenti();
          
          
          this.messaggio.open('Documento eliminato con successo!', 'Chiudi', { 
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        },
        error: (error) => {
          console.error('Errore nell\'eliminazione:', error);
          
          
          this.messaggio.open(`Errore nell'eliminazione del documento: ${error}`, 'Chiudi', { 
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        }
      });
    }
  }

  // Metodo per ricaricare i documenti
  ricaricaDocumenti(): void {
    if(this.ruoloUtente === 'SEGRETARIO'){
      this.getTuttiDocumenti();
    } else {
      this.getDocumentiUtente();
    }
  }

  


  getDocumentiUtente(){
    this.user = this.sessione.getLoggedUser();

    if (this.user) {
      this.docService.getDocumenti({ proprietario_id: this.user.id }).subscribe({
        next: (docs) => {
          this.documenti = docs;
          
        }
      })
    }
  };

  getTuttiDocumenti(){
    this.docService.getDocumenti().subscribe({
      next: (docs) => {
        console.log(docs);
        this.documenti = docs;
        
      }
    })
  };
}
