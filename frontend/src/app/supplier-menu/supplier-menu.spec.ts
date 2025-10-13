import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierMenu } from './supplier-menu';

describe('SupplierMenu', () => {
  let component: SupplierMenu;
  let fixture: ComponentFixture<SupplierMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierMenu]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
