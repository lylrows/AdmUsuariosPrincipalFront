import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudNineboxComponent } from './crud-ninebox.component';

describe('CrudNineboxComponent', () => {
  let component: CrudNineboxComponent;
  let fixture: ComponentFixture<CrudNineboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrudNineboxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrudNineboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
