import { bootstrapApplication } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h3>Built-in pipes</h3>
    <p>Today: {{ today | date:'yyyy-MM-dd' }}</p>
    <p>Name: {{ name | uppercase }}</p>
    <p>Chained: {{ ratio | percent:'1.0-5' | uppercase }}</p>
  `
})
export class App {
  today = new Date();
  name = 'Ada Lovelace';
  ratio = 0.7566547;
}

bootstrapApplication(App);