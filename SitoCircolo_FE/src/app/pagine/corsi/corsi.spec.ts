import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Corsi } from './corsi';

describe('Corsi', () => {
  let component: Corsi;
  let fixture: ComponentFixture<Corsi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Corsi]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Corsi);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
