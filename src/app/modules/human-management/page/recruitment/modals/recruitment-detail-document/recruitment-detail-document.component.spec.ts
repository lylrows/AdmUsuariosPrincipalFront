import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruitmentDetailDocumentComponent } from './recruitment-detail-document.component';

describe('RecruitmentDetailDocumentComponent', () => {
  let component: RecruitmentDetailDocumentComponent;
  let fixture: ComponentFixture<RecruitmentDetailDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecruitmentDetailDocumentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecruitmentDetailDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
