import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadBillComponent } from './upload-bill';

describe('UploadBillComponent', () => {
  let component: UploadBillComponent;
  let fixture: ComponentFixture<UploadBillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadBillComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
