import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyTeamResumeV2Component } from './my-team-resume-v2.component';

describe('MyTeamResumeV2Component', () => {
  let component: MyTeamResumeV2Component;
  let fixture: ComponentFixture<MyTeamResumeV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyTeamResumeV2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyTeamResumeV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
