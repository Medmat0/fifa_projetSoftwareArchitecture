import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditUsersComponent } from './edit-users.component';
import { SecretaryUserService } from '../../../../secretary/services/secretary-user.service';
import { of, throwError } from 'rxjs';
import { User, Role, VehicleType } from '../../../../shared/models/user';

describe('EditUsersComponent', () => {
  let component: EditUsersComponent;
  let fixture: ComponentFixture<EditUsersComponent>;
  let mockService: jasmine.SpyObj<SecretaryUserService>;

  const mockUsers: User[] = [
    {
      id: '1',
      email: 'a@a.fr',
      name: 'A',
      password: 'x',
      role: Role.EMPLOYEE,
      vehicleType: VehicleType.UNKNOWN,
      reservations: []
    }
  ];

  beforeEach(async () => {
    mockService = jasmine.createSpyObj('SecretaryUserService', ['getAllEmployees']);
    await TestBed.configureTestingModule({
      imports: [EditUsersComponent],
      providers: [
        { provide: SecretaryUserService, useValue: mockService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditUsersComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('doit charger les utilisateurs au démarrage', () => {
    mockService.getAllEmployees.and.returnValue(of(mockUsers));
    component.ngOnInit();
    expect(component.users).toEqual(mockUsers);
  });

  it('doit gérer une erreur lors du chargement des utilisateurs', () => {
    spyOn(console, 'error');
    mockService.getAllEmployees.and.returnValue(throwError(() => new Error('Erreur')));
    component.ngOnInit();
    expect(console.error).toHaveBeenCalled();
  });

  it('doit ajouter un utilisateur', () => {
    const newUser: User = {
      id: '2',
      email: 'b@b.fr',
      name: 'B',
      password: 'y',
      role: Role.EMPLOYEE,
      vehicleType: VehicleType.UNKNOWN,
      reservations: []
    };
    component.users = [...mockUsers];
    component.addUser(newUser);
    expect(component.users).toContain(newUser);
    expect(component.users.length).toBe(2);
  });

  it('doit basculer showCreation', () => {
    expect(component.showCreation).toBeFalse();
    component.toggleCreation();
    expect(component.showCreation).toBeTrue();
    component.toggleCreation();
    expect(component.showCreation).toBeFalse();
  });
});
