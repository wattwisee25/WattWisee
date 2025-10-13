import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Renewable } from './renewable';

describe('Renewable', () => {
  let component: Renewable;
  let fixture: ComponentFixture<Renewable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Renewable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Renewable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
