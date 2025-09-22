import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Documenti } from './documenti';

describe('Documenti', () => {
  let component: Documenti;
  let fixture: ComponentFixture<Documenti>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Documenti]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Documenti);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
