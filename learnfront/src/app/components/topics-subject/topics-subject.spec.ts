import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicsSubject } from './topics-subject';

describe('TopicsSubject', () => {
  let component: TopicsSubject;
  let fixture: ComponentFixture<TopicsSubject>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TopicsSubject]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopicsSubject);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
