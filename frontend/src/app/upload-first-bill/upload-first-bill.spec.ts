import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadFirstBillComponent } from './upload-first-bill';

describe('UploadFirstBillComponent', () => {
  let component: UploadFirstBillComponent;
  let fixture: ComponentFixture<UploadFirstBillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadFirstBillComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadFirstBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
