import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';
import { Sessione } from '../../servizi/sessione';
import { User, UserRole } from '../../modelli/user.model';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, MatSidenavModule, MatListModule, MatIcon],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit {

  user: User | null = null;
  ruoloUtente: UserRole | null = null;

  constructor(
    private sessione: Sessione
  ){}

  ngOnInit(): void {
      this.user = this.sessione.getLoggedUser();
      this.ruoloUtente = this.sessione.getUserRole();
  }

}
