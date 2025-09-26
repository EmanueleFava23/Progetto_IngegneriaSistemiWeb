import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Carnet } from './carnet';

describe('Carnet', () => {
  let component: Carnet;
  let fixture: ComponentFixture<Carnet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Carnet]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Carnet);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
