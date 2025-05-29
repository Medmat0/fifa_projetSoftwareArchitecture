import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationMapComponent } from './reservation-map.component';

describe('ReservationMapComponent', () => {
  let component: ReservationMapComponent;
  let fixture: ComponentFixture<ReservationMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationMapComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservationMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
