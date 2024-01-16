import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEvaluationComponent } from './modal-evaluation.component';

describe('ModalEvaluationComponent', () => {
  let component: ModalEvaluationComponent;
  let fixture: ComponentFixture<ModalEvaluationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalEvaluationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalEvaluationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
