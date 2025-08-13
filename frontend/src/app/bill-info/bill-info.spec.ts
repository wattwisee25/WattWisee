import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillInfoComponent } from './bill-info';

describe('BillInfoComponent', () => {
  let component: BillInfoComponent;
  let fixture: ComponentFixture<BillInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
