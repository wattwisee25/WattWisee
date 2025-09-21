import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillExampleComponent } from './bill-example';

describe('BillExample', () => {
  let component: BillExampleComponent;
  let fixture: ComponentFixture<BillExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillExampleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
