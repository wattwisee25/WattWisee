import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenewableComponent } from './renewable';

describe('Renewable', () => {
  let component: RenewableComponent;
  let fixture: ComponentFixture<RenewableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RenewableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RenewableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
