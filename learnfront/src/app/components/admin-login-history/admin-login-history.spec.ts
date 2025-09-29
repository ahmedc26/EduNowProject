import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminLoginHistory } from './admin-login-history';

describe('AdminLoginHistory', () => {
  let component: AdminLoginHistory;
  let fixture: ComponentFixture<AdminLoginHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminLoginHistory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminLoginHistory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
