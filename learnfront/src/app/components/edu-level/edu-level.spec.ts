import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EduLevel } from './edu-level';

describe('EduLevel', () => {
  let component: EduLevel;
  let fixture: ComponentFixture<EduLevel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EduLevel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EduLevel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
