import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LezioniDialog } from './lezioni-dialog';

describe('LezioniDialog', () => {
  let component: LezioniDialog;
  let fixture: ComponentFixture<LezioniDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LezioniDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LezioniDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
