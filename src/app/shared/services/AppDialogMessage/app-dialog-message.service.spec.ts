import { TestBed } from '@angular/core/testing';

import { AppDialogMessageService } from './app-dialog-message.service';

describe('AppDialogMessageService', () => {
  let service: AppDialogMessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppDialogMessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
