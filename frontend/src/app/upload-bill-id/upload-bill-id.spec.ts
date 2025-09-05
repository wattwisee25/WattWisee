import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadBillIdComponent } from './upload-bill-id';

describe('UploadBillId', () => {
  let component: UploadBillIdComponent;
  let fixture: ComponentFixture<UploadBillIdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadBillIdComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadBillIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
