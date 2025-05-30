import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserCreationComponent } from './user-creation.component';
import { SecretaryUserService } from '../../../../../../secretary/services/secretary-user.service';
import { of, throwError } from 'rxjs';
import { Role, VehicleType } from '../../../../../../shared/models/user';

describe('UserCreationComponent', () => {
  let component: UserCreationComponent;
  let fixture: ComponentFixture<UserCreationComponent>;
  let mockService: jasmine.SpyObj<SecretaryUserService>;

  beforeEach(async () => {
    mockService = jasmine.createSpyObj('SecretaryUserService', ['addEmployee']);
    await TestBed.configureTestingModule({
      imports: [UserCreationComponent],
      providers: [
        { provide: SecretaryUserService, useValue: mockService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait appeler addEmployee et émettre les événements après succès', () => {
    spyOn(component.userCreated, 'emit');
    spyOn(component.closeCreation, 'emit');
    const mockResponse = { id: '1', ...component.userDTO };
    mockService.addEmployee.and.returnValue(of(mockResponse));

    // Remplir le formulaire
    component.userDTO = {
      email: 'test@test.fr',
      name: 'Test',
      password: 'secret',
      role: Role.EMPLOYEE,
      vehicleType: VehicleType.ELECTRIC,
      reservations: []
    };

    component.onCreationSubmit();

    expect(mockService.addEmployee).toHaveBeenCalledWith(jasmine.objectContaining({
      email: 'test@test.fr',
      name: 'Test'
    }));
    expect(component.userCreated.emit).toHaveBeenCalledWith(mockResponse);
    expect(component.closeCreation.emit).toHaveBeenCalled();
  });

  it('devrait gérer une erreur lors de la création', () => {
    spyOn(console, 'error');
    mockService.addEmployee.and.returnValue(throwError(() => new Error('Erreur création')));

    component.userDTO = {
      email: 'fail@test.fr',
      name: 'Fail',
      password: 'fail',
      role: Role.EMPLOYEE,
      vehicleType: VehicleType.HYBRID,
      reservations: []
    };

    component.onCreationSubmit();

    expect(console.error).toHaveBeenCalled();
  });

  it('ne fait rien si userDTO est indéfini', () => {
    component.userDTO = undefined as any;
    expect(() => component.onCreationSubmit()).not.toThrow();
    expect(mockService.addEmployee).not.toHaveBeenCalled();
  });
});
