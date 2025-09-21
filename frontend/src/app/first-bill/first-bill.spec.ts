import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstBillComponent } from './first-bill';

describe('FirstBillComponent', () => {
  let component: FirstBillComponent;
  let fixture: ComponentFixture<FirstBillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FirstBillComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FirstBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
