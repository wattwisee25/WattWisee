import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionPlanSupplierComponent } from './action-plan-supplier';

describe('ActionPlanSupplierComponent', () => {
  let component: ActionPlanSupplierComponent;
  let fixture: ComponentFixture<ActionPlanSupplierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionPlanSupplierComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionPlanSupplierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
