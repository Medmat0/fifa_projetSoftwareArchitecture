import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsersListComponent } from './users-list.component';
import { User, Role, VehicleType } from '../../../../../../shared/models/user';
import { SecretaryUserService } from '../../../../../../secretary/services/secretary-user.service';
import { of, throwError } from 'rxjs';

describe('UsersListComponent', () => {
  let component: UsersListComponent;
  let fixture: ComponentFixture<UsersListComponent>;
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
    },
    {
      id: '2',
      email: 'b@b.fr',
      name: 'B',
      password: 'y',
      role: Role.EMPLOYEE,
      vehicleType: VehicleType.UNKNOWN,
      reservations: []
    }
  ];

  beforeEach(async () => {
    mockService = jasmine.createSpyObj('SecretaryUserService', ['deleteEmployee']);
    await TestBed.configureTestingModule({
      imports: [UsersListComponent],
      providers: [
        { provide: SecretaryUserService, useValue: mockService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UsersListComponent);
    component = fixture.componentInstance;
    component.users = [...mockUsers];
    fixture.detectChanges();
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait afficher la liste des utilisateurs', () => {
    expect(component.users.length).toBe(2);
    expect(component.users[0].name).toBe('A');
    expect(component.users[1].name).toBe('B');
  });

  it('devrait sélectionner un utilisateur et afficher la description', () => {
    component.toggleDescription(mockUsers[0]);
    expect(component.showDescription).toBeTrue();
    expect(component.selectedUser).toEqual(mockUsers[0]);
  });

  it('devrait sélectionner un utilisateur et afficher la modification', () => {
    component.toggleModification(mockUsers[1]);
    expect(component.showModification).toBeTrue();
    expect(component.selectedUser).toEqual(mockUsers[1]);
  });

  it('devrait supprimer un utilisateur après confirmation', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    mockService.deleteEmployee.and.returnValue(of({}));
    component.deleteUser(mockUsers[0]);
    expect(mockService.deleteEmployee).toHaveBeenCalledWith('1');
    expect(component.users.length).toBe(1);
    expect(component.users[0].id).toBe('2');
  });

  it('ne devrait pas supprimer si annulation', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    component.deleteUser(mockUsers[0]);
    expect(mockService.deleteEmployee).not.toHaveBeenCalled();
    expect(component.users.length).toBe(2);
  });

  it('devrait gérer une erreur lors de la suppression', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(console, 'error');
    mockService.deleteEmployee.and.returnValue(throwError(() => new Error('Erreur suppression')));
    component.deleteUser(mockUsers[0]);
    expect(console.error).toHaveBeenCalled();
  });
});
