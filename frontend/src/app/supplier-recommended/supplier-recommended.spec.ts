import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierRecommended } from './supplier-recommended';

describe('SupplierRecommended', () => {
  let component: SupplierRecommended;
  let fixture: ComponentFixture<SupplierRecommended>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierRecommended]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierRecommended);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
