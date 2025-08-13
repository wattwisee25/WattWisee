import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionPlanComponent } from './action-plan';

describe('ActionPlan', () => {
  let component: ActionPlanComponent;
  let fixture: ComponentFixture<ActionPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionPlanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
