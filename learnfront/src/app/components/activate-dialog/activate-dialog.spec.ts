import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivateDialog } from './activate-dialog';

describe('ActivateDialog', () => {
  let component: ActivateDialog;
  let fixture: ComponentFixture<ActivateDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ActivateDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActivateDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
