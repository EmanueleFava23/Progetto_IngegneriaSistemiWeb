import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserRole } from '../../../modelli/user.model';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CourseService } from '../../../servizi/course.service';
import { Sessione } from '../../../servizi/sessione';
import { Corso } from '../../../modelli/course.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-dialog-corso',
  imports: [MatDialogModule, MatButtonModule, ReactiveFormsModule],
  templateUrl: './dialog-corso.html',
  styleUrl: './dialog-corso.css'
})
export class DialogCorso implements OnInit{

  form: FormGroup;
  ruoloUtente!: UserRole;

  ngOnInit(): void {
      this.ruoloUtente = this.sessione.getUserRole();
      if(this.dati){
        this.form.get('data_inizio')?.setValue(this.formattaData(this.dati.data_inizio));
        this.form.get('data_fine')?.setValue(this.formattaData(this.dati.data_fine));
      }
  }

  constructor(
    private builder: FormBuilder,
    private dialogoRef: MatDialogRef<DialogCorso>,
    private corsoService: CourseService,
    private sessione: Sessione,
    private messaggio: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public dati: Corso
  ){
    this.form = this.builder.group({
      nome: [dati?.nome || ''],
      descrizione: [dati?.descrizione || ''],
      max_partecipanti: [dati?.max_partecipanti || 0],
      livello: [dati?.livello || ''],
      data_inizio: [dati?.data_inizio || ''],
      data_fine: [dati?.data_fine || ''],
    });
  };

  caricaCorso(){
    if(this.form.valid){
      const user = this.sessione.getLoggedUser();
      const DatiCorso = {...this.form.value, creato_da: user?.id};
      this.corsoService.creaCorso(DatiCorso).subscribe({
        next: (res) => {
          this.messaggio.open('Corso creato con successo!', 'Chiudi', { duration: 3000 });
          this.dialogoRef.close(true);
        },
        error: (err) => {
          this.messaggio.open('Errore nella creazione del corso. Riprova.', 'Chiudi', { duration: 3000 });
        }
      });
    }
  }
  

  modificaCorso(){
    if(this.form.valid && this.dati){
      const DatiCorso = {...this.form.value};
      this.corsoService.modificaCorso(this.dati.id, DatiCorso).subscribe({
        next: (res) => {
          this.messaggio.open('Corso modificato con successo!', 'Chiudi', { duration: 3000 });
          this.dialogoRef.close(true);
        },
        error: (err) => {
          this.messaggio.open('Errore nella modifica del corso. Riprova.', 'Chiudi', { duration: 3000 });
        }
      });
    }
  }

  formattaData(data: string): string {
    return new Date(data).toLocaleDateString('en-CA');
  };
}
