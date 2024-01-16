import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogStaffRequestSalaryComponent } from './dialog-staff-request-salary.component';

describe('DialogStaffRequestSalaryComponent', () => {
  let component: DialogStaffRequestSalaryComponent;
  let fixture: ComponentFixture<DialogStaffRequestSalaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogStaffRequestSalaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogStaffRequestSalaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
