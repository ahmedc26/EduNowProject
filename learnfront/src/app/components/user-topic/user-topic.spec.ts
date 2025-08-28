import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTopic } from './user-topic';

describe('UserTopic', () => {
  let component: UserTopic;
  let fixture: ComponentFixture<UserTopic>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserTopic]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserTopic);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
