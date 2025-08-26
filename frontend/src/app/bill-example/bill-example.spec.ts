import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillExample } from './bill-example';

describe('BillExample', () => {
  let component: BillExample;
  let fixture: ComponentFixture<BillExample>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillExample]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillExample);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
