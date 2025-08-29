import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicsLevel } from './topics-level';

describe('TopicsLevel', () => {
  let component: TopicsLevel;
  let fixture: ComponentFixture<TopicsLevel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TopicsLevel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopicsLevel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
