import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillInformationComponent } from './bill-information';

describe('BillInformationComponent', () => {
  let component: BillInformationComponent;
  let fixture: ComponentFixture<BillInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillInformationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
