import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Imbarcazioni } from './imbarcazioni';

describe('Imbarcazioni', () => {
  let component: Imbarcazioni;
  let fixture: ComponentFixture<Imbarcazioni>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Imbarcazioni]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Imbarcazioni);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
