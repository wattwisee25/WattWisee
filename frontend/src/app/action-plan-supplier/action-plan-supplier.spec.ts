import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionPlanSupplier } from './action-plan-supplier';

describe('ActionPlanSupplier', () => {
  let component: ActionPlanSupplier;
  let fixture: ComponentFixture<ActionPlanSupplier>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionPlanSupplier]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionPlanSupplier);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
