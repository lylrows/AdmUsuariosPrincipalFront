import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogNineboxComponent } from './dialog-ninebox.component';

describe('DialogNineboxComponent', () => {
  let component: DialogNineboxComponent;
  let fixture: ComponentFixture<DialogNineboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogNineboxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogNineboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
