import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCorso } from './dialog-corso';

describe('DialogCorso', () => {
  let component: DialogCorso;
  let fixture: ComponentFixture<DialogCorso>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogCorso]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogCorso);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
