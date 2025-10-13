import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierPersonalData } from './supplier-personal-data';

describe('SupplierPersonalData', () => {
  let component: SupplierPersonalData;
  let fixture: ComponentFixture<SupplierPersonalData>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierPersonalData]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierPersonalData);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
