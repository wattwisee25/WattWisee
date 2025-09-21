import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionPlan2Component } from './action-plan-2';

describe('ActionPlan2Component', () => {
  let component: ActionPlan2Component;
  let fixture: ComponentFixture<ActionPlan2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionPlan2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionPlan2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
