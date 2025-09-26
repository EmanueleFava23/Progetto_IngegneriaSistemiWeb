import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../servizi/auth';
import { CommonModule } from '@angular/common';
import { NuovoUser, User, UserRole } from '../../modelli/user.model';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  
  username: string = '';
  password: string = '';
  nome: string = '';
  cognome: string = '';
  email: string = '';
  data_nascita: string = '';
  cod_fisc: string = '';
  telefono: string = '';
  ruolo: UserRole = 'CORSISTA'; // Valore di default

  register: boolean = false;

  // Array dei ruoli disponibili per il dropdown
  availableRoles: UserRole[] = ['CORSISTA', 'ISTRUTTORE', 'SEGRETARIO'];

  
  constructor(
    private authService: Auth
  ) {};
  
  SubmitLogin(): void {
    if (this.username && this.password) {
      this.authService.errore = ''; // pulisce gli errori precedenti
      
      this.authService.login(this.username, this.password);
      
    }
  }

  SubmitRegistrazione(): void{
    if (this.username && this.password && this.nome && this.cognome && this.email && this.data_nascita && this.ruolo) {
      this.authService.errore = ''; // Pulisce errori precedenti
      
      let user: NuovoUser = {
        username: this.username,
        password: this.password,
        nome: this.nome,
        cognome: this.cognome,
        email: this.email,
        data_nascita: this.data_nascita,
        telefono: this.telefono,
        cod_fiscale: this.cod_fisc,
        ruolo: this.ruolo
      };

      this.authService.register(user);
      
      setTimeout(() => {
        // Se non ci sono errori, torna al login
        if (!this.authService.errore) {
          this.register = false;
          this.clearForm();
        }
      }, 2000);
    } else {
      this.authService.errore = 'Tutti i campi obbligatori devono essere compilati';
    }
  };
  
  get errorMessage(): string {
    return this.authService.errore;
  };

  registrazione(): void{
    this.register = true;
    this.authService.errore = ''; 
  };
  
  login(): void{
    this.register = false;
    this.authService.errore = ''; // Pulisce errori quando cambi modalità
  };
  
  // puliza form
  private clearForm(): void {
    this.username = '';
    this.password = '';
    this.nome = '';
    this.cognome = '';
    this.email = '';
    this.data_nascita = '';
    this.cod_fisc = '';
    this.telefono = '';
    this.ruolo = 'CORSISTA'; // Reset al valore di default
  }
  
}