import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserDescriptionComponent } from './user-description.component';
import { User, Role, VehicleType } from '../../../../../../shared/models/user';
import { Reservation } from '../../../../../../shared/models/reservation';
import { By } from '@angular/platform-browser';

describe('UserDescriptionComponent', () => {
  let component: UserDescriptionComponent;
  let fixture: ComponentFixture<UserDescriptionComponent>;

  const mockReservations: Reservation[] = [
    {
      id: 'r1',
      userId: '1',
      slotId: 's1',
      startDate: new Date('2024-06-01T08:00:00Z'),
      endDate: new Date('2024-06-01T12:00:00Z'),
      halfDay: false,
      createdAt: new Date('2024-05-30T10:00:00Z')
    },
    {
      id: 'r2',
      userId: '1',
      slotId: 's2',
      startDate: new Date('2024-06-02T13:00:00Z'),
      endDate: new Date('2024-06-02T17:00:00Z'),
      halfDay: true,
      createdAt: new Date('2024-05-31T11:00:00Z')
    }
  ];

  const mockUser: User = {
    id: '1',
    email: 'test@test.fr',
    name: 'Test User',
    password: 'secret',
    role: Role.EMPLOYEE,
    vehicleType: VehicleType.UNKNOWN,
    reservations: mockReservations
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserDescriptionComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(UserDescriptionComponent);
    component = fixture.componentInstance;
    component.user = mockUser;
    fixture.detectChanges();
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait afficher le nom, l\'email et le rôle', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Test User');
    expect(compiled.textContent).toContain('test@test.fr');
    expect(compiled.textContent).toContain('EMPLOYEE');
  });


  it('devrait émettre l\'événement closeDescription quand on clique sur le bouton', () => {
    spyOn(component.closeDescription, 'emit');
    const button = fixture.debugElement.query(By.css('button'));
    button.nativeElement.click();
    expect(component.closeDescription.emit).toHaveBeenCalled();
  });
});
