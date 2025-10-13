import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierOtp } from './supplier-otp';

describe('SupplierOtp', () => {
  let component: SupplierOtp;
  let fixture: ComponentFixture<SupplierOtp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierOtp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierOtp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
