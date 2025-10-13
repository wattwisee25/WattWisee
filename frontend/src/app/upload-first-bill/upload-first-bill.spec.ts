import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadFirstBill } from './upload-first-bill';

describe('UploadFirstBill', () => {
  let component: UploadFirstBill;
  let fixture: ComponentFixture<UploadFirstBill>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadFirstBill]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadFirstBill);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
