import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Lezioni } from './lezioni';

describe('Lezioni', () => {
  let component: Lezioni;
  let fixture: ComponentFixture<Lezioni>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Lezioni]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Lezioni);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
