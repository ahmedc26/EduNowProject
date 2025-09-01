import { TestBed } from '@angular/core/testing';

import { StudentAuthGuardService } from './student-auth-guard.service';

describe('StudentAuthGuardService', () => {
  let service: StudentAuthGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentAuthGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
