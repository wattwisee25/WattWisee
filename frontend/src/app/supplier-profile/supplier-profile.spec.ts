import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierProfile } from './supplier-profile';

describe('SupplierProfile', () => {
  let component: SupplierProfile;
  let fixture: ComponentFixture<SupplierProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierProfile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierProfile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
