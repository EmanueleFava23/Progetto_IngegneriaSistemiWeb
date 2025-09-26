import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Documento } from '../../../modelli/document.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { DocumentService } from '../../../servizi/document.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Sessione } from '../../../servizi/sessione';
import { UserRole } from '../../../modelli/user.model';


@Component({
  selector: 'app-aggiungi-documento-dialog',
  imports: [MatDialogModule, MatButtonModule, ReactiveFormsModule],
  templateUrl: './aggiungi-documento-dialog.html',
  styleUrl: './aggiungi-documento-dialog.css'
})
export class AggiungiDocumentoDialog implements OnInit {



  form: FormGroup;
  ruoloUtente!: UserRole;

  ngOnInit() {
    this.ruoloUtente = this.sessione.getUserRole();
    if (this.dati) {
      this.form.get('data_rilascio')?.setValue(this.formattaData(this.dati.data_rilascio));
      this.form.get('data_scadenza')?.setValue(this.formattaData(this.dati.data_scadenza));
    }
  }

  constructor(
    private builder: FormBuilder,
    private dialogRef: MatDialogRef<AggiungiDocumentoDialog>,
    private docService: DocumentService,
    private sessione: Sessione,
    private messaggio: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public dati: Documento
  ){
    this.form = this.builder.group({
      num_documento: [dati?.num_documento || ''],
      data_rilascio: [dati?.data_rilascio || ''],
      data_scadenza: [dati?.data_scadenza || ''],
      tipologia: [dati?.tipologia || ''],
      validato: [dati?.validato || false]
    });
  };

  

  caricaDocumento(){
    if(this.form.valid){
      const user = this.sessione.getLoggedUser(); 
      const DatiDoc = {...this.form.value, proprietario_id: user?.id};
      this.docService.creaDocumento(DatiDoc).subscribe({
        next: () => {
          this.messaggio.open('Documento caricato con successo!', 'Chiudi', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          this.dialogRef.close(true);
        },
        error: (err) => {
          this.messaggio.open(`Errore nel caricamento del documento: ${err}`, 'Chiudi', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        }
      })
    }
  }

  modificaDocumento(){
    if(this.form.valid && this.dati){
      const DatiDoc = {...this.form.value};
      this.docService.modificaDocumento(this.dati.id, DatiDoc).subscribe({
        next: () => {
          this.messaggio.open('Documento modificato con successo!', 'Chiudi', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          this.dialogRef.close(true);
        },
        error: (err) => {
          this.messaggio.open(`Errore nella modifica del documento: ${err}`, 'Chiudi', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        }
      })
    }
  }

  formattaData(data: Date): string {
    return new Date(data).toLocaleDateString('en-CA'); // Formato YYYY-MM-DD
  }
}
