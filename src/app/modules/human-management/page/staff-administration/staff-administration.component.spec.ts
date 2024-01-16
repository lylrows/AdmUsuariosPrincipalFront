import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffAdministrationComponent } from './staff-administration.component';

describe('StaffAdministrationComponent', () => {
  let component: StaffAdministrationComponent;
  let fixture: ComponentFixture<StaffAdministrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StaffAdministrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffAdministrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
