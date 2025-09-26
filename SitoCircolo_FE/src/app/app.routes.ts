import { Routes } from '@angular/router';
import { Corsi } from './pagine/corsi/corsi';
import { Lezioni } from './pagine/lezioni/lezioni';
import { Documenti } from './pagine/documenti/documenti';
import { Home } from './pagine/home/home';
import { Profilo } from './pagine/profilo/profilo';
import { CarnetPage } from './pagine/carnet/carnet';
import { Login } from './componenti/login/login';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full'},
    { path: 'home', component: Home},
    { path: 'corsi', component: Corsi},
    { path: 'lezioni', component: Lezioni},
    { path: 'documenti', component: Documenti},
    { path: 'profilo', component: Profilo},
    { path: 'carnet', component:CarnetPage},
    { path: 'login', component: Login}
];
