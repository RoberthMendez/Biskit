import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RazonComponent } from './razon.component';

describe('RazonComponent', () => {
  let component: RazonComponent;
  let fixture: ComponentFixture<RazonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RazonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RazonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
