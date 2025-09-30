import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';
import { Sessione } from '../../servizi/sessione';
import { User, UserRole } from '../../modelli/user.model';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, MatSidenavModule, MatListModule, MatIcon],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit, OnDestroy {

  user: User | null = null;
  ruoloUtente: UserRole | null = null;
  private routerSubscription?: Subscription;

  constructor(
    private sessione: Sessione,
    private router: Router,
    private changeDetector: ChangeDetectorRef
  ){}

  ngOnInit(): void {
      this.aggiornaUtente();
      
      // Ascolta i cambiamenti di route per aggiornare i dati
      this.routerSubscription = this.router.events
        .pipe(filter(event => event instanceof NavigationEnd))
        .subscribe(() => {
          this.aggiornaUtente();
        });
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  private aggiornaUtente(): void {
    this.user = this.sessione.getLoggedUser();
    this.ruoloUtente = this.sessione.getUserRole();
    this.changeDetector.detectChanges();
  }

}
