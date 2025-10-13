import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillInformation } from './bill-information';

describe('BillInformation', () => {
  let component: BillInformation;
  let fixture: ComponentFixture<BillInformation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillInformation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillInformation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
