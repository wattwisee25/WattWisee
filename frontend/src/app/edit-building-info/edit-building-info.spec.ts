import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBuildingInfo } from './edit-building-info';

describe('EditBuildingInfo', () => {
  let component: EditBuildingInfo;
  let fixture: ComponentFixture<EditBuildingInfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditBuildingInfo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditBuildingInfo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
