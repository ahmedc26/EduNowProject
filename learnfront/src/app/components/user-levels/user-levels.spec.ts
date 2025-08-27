import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserLevels } from './user-levels';

describe('UserLevels', () => {
  let component: UserLevels;
  let fixture: ComponentFixture<UserLevels>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserLevels]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserLevels);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
