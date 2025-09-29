import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentQuestionGeneration } from './student-question-generation';

describe('StudentQuestionGeneration', () => {
  let component: StudentQuestionGeneration;
  let fixture: ComponentFixture<StudentQuestionGeneration>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StudentQuestionGeneration]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentQuestionGeneration);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
