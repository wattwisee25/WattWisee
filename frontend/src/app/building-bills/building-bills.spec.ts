import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildingBillsComponent } from './building-bills';

describe('BuildingBillsComponent', () => {
  let component: BuildingBillsComponent;
  let fixture: ComponentFixture<BuildingBillsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuildingBillsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuildingBillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
