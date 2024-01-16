import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppDialogMessageComponent } from './app-dialog-message.component';

describe('AppDialogMessageComponent', () => {
  let component: AppDialogMessageComponent;
  let fixture: ComponentFixture<AppDialogMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppDialogMessageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppDialogMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
