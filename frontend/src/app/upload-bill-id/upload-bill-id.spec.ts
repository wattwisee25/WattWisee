import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadBillId } from './upload-bill-id';

describe('UploadBillId', () => {
  let component: UploadBillId;
  let fixture: ComponentFixture<UploadBillId>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadBillId]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadBillId);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
