import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierOtpComponent } from './supplier-otp';

describe('SupplierOtpComponent', () => {
  let component: SupplierOtpComponent;
  let fixture: ComponentFixture<SupplierOtpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierOtpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierOtpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
