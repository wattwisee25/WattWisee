import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierSetting } from './supplier-setting';

describe('SupplierSetting', () => {
  let component: SupplierSetting;
  let fixture: ComponentFixture<SupplierSetting>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierSetting]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierSetting);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
