import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthBillComponent } from './month-bill';

describe('MonthBillComponent', () => {
  let component: MonthBillComponent;
  let fixture: ComponentFixture<MonthBillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthBillComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
