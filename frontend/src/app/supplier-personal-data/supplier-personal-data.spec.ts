import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierPersonalDataComponent } from './supplier-personal-data';

describe('SupplierPersonalDataComponent', () => {
  let component: SupplierPersonalDataComponent;
  let fixture: ComponentFixture<SupplierPersonalDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierPersonalDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierPersonalDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
