import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Navbar } from './componenti/navbar/navbar';
import { RouterOutlet } from '@angular/router';
import { Sessione } from './servizi/sessione';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { Login } from "./componenti/login/login";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, Navbar, RouterOutlet, MatSidenavModule, MatToolbarModule, MatIcon, Login],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App{

  opened: string = 'opened';

  constructor(
    private sessione: Sessione,
  ) {}




  Loggato(): boolean {
    return this.sessione.isLoggedIn();
  }
}