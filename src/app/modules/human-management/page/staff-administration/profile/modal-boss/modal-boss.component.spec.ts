import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalBossComponent } from './modal-boss.component';

describe('ModalBossComponent', () => {
  let component: ModalBossComponent;
  let fixture: ComponentFixture<ModalBossComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalBossComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalBossComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
