import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { LessonService } from '../../../servizi/lesson.service';
import { Sessione } from '../../../servizi/sessione';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Lezione } from '../../../modelli/lesson.model';
import { MatButtonModule } from '@angular/material/button';
import { Corso } from '../../../modelli/course.model';
import { CourseService } from '../../../servizi/course.service';

@Component({
  selector: 'app-lezioni-dialog',
  imports: [ReactiveFormsModule, MatDialogModule, MatButtonModule],
  templateUrl: './lezioni-dialog.html',
  styleUrl: './lezioni-dialog.css'
})

export class LezioniDialog implements OnInit {

  form: FormGroup;
  corsi: Corso[] = [];

  ngOnInit() {
    // Carica sempre i corsi, sia per nuove lezioni che per modifiche
    this.caricaCorsi();
    
    if (this.dati) {
      this.form.patchValue(this.dati);
      this.form.get('data')?.setValue(this.formattaData(this.dati.data));
    }
  }

  constructor(
    private builder: FormBuilder,
    private dialogRef: MatDialogRef<LezioniDialog>,
    private lessonService: LessonService,
    private corsoService: CourseService,
    private sessione: Sessione,
    private messaggio: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public dati: Lezione
  ){
    this.form = this.builder.group({
      data: [dati?.data || ''],
      ora_inizio: [dati?.ora_inizio || ''],
      ora_fine: [dati?.ora_fine || ''],
      corso_id: [dati?.corso_id || ''],
      note: [dati?.note || '']
    });
  }

  formattaData(data: Date): string {
    return new Date(data).toISOString().split('T')[0];
  }

  caricaCorsi(): void {
    this.corsoService.getCorsi().subscribe({
      next: (corsi) => {
        this.corsi = corsi;

      },
      error: (error) =>{
        this.messaggio.open(`Errore nel caricamento dei corsi: ${error}`, 'Chiudi', {
          duration: 5000
        });
      }
    });
  }

  caricaLezione(){
    if(this.form.valid){
      const user = this.sessione.getLoggedUser();
      console.log(user);
      const DatiLezione = {...this.form.value, proposta_da: user?.id};
      this.lessonService.creaLezione(DatiLezione).subscribe({
        next: (res) => {
          this.messaggio.open('Lezione creata con successo!', 'Chiudi', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          this.dialogRef.close(true);
        },
        error: (error) =>{
          this.messaggio.open(`Errore nella creazione della lezione: ${error}`, 'Chiudi', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        }
      });
    }
  }
  modificaLezione(){
    if(this.form.valid && this.dati){
      const DatiLezione = {...this.form.value, approvata_da: null, stato: "proposta"};
      this.lessonService.modificaLezione(this.dati.id, DatiLezione).subscribe({
        next: (res) => {
          this.messaggio.open('Lezione modificata con successo!', 'Chiudi', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          this.dialogRef.close(true);
        },
        error: (error) =>{
          this.messaggio.open(`Errore nella modifica della lezione: ${error}`, 'Chiudi', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        }
      });
    }
  }
}
