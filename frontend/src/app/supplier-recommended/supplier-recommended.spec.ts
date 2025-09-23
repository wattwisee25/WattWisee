import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierRecommendedComponent } from './supplier-recommended';

describe('SupplierRecommendedComponent', () => {
  let component: SupplierRecommendedComponent;
  let fixture: ComponentFixture<SupplierRecommendedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierRecommendedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierRecommendedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
