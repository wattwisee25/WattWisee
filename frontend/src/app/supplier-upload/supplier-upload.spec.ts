import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierUpload } from './supplier-upload';

describe('SupplierUpload', () => {
  let component: SupplierUpload;
  let fixture: ComponentFixture<SupplierUpload>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierUpload]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierUpload);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
