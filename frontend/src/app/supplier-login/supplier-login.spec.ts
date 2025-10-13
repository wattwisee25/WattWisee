import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierLogin } from './supplier-login';

describe('SupplierLogin', () => {
  let component: SupplierLogin;
  let fixture: ComponentFixture<SupplierLogin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierLogin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierLogin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
