import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NineBoxComponent } from './nine-box.component';

describe('NineBoxComponent', () => {
  let component: NineBoxComponent;
  let fixture: ComponentFixture<NineBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NineBoxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NineBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
