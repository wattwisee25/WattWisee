import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildingInfo } from './building-info';

describe('BuildingInfo', () => {
  let component: BuildingInfo;
  let fixture: ComponentFixture<BuildingInfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuildingInfo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuildingInfo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
