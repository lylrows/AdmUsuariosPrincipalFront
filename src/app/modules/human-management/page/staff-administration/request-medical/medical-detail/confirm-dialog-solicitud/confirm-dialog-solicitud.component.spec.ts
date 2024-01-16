import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDialogSolicitudComponent } from './confirm-dialog-solicitud.component';

describe('ConfirmDialogSolicitudComponent', () => {
  let component: ConfirmDialogSolicitudComponent;
  let fixture: ComponentFixture<ConfirmDialogSolicitudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmDialogSolicitudComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmDialogSolicitudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
