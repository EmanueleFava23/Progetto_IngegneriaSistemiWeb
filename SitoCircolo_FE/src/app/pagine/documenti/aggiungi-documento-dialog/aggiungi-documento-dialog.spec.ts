import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AggiungiDocumentoDialog } from './aggiungi-documento-dialog';

describe('AggiungiDocumentoDialog', () => {
  let component: AggiungiDocumentoDialog;
  let fixture: ComponentFixture<AggiungiDocumentoDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AggiungiDocumentoDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AggiungiDocumentoDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
