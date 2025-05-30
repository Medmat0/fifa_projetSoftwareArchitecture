import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserModificationComponent } from './user-modification.component';
import { User, Role, VehicleType } from '../../../../../../shared/models/user';
import { SecretaryUserService } from '../../../../../../secretary/services/secretary-user.service';
import { of, throwError } from 'rxjs';

describe('UserModificationComponent', () => {
  let component: UserModificationComponent;
  let fixture: ComponentFixture<UserModificationComponent>;
  let mockService: jasmine.SpyObj<SecretaryUserService>;

  const mockUser: User = {
    id: '1',
    email: 'test@test.fr',
    name: 'Test User',
    password: 'secret',
    role: Role.EMPLOYEE,
    vehicleType: VehicleType.UNKNOWN,
    reservations: []
  };

  beforeEach(async () => {
    mockService = jasmine.createSpyObj('SecretaryUserService', ['modifyEmployee']);
    await TestBed.configureTestingModule({
      imports: [UserModificationComponent],
      providers: [
        { provide: SecretaryUserService, useValue: mockService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserModificationComponent);
    component = fixture.componentInstance;
    component.user = { ...mockUser };
    fixture.detectChanges();
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait appeler modifyEmployee et fermer après succès', () => {
    spyOn(component.closeModification, 'emit');
    mockService.modifyEmployee.and.returnValue(of({}));
    component.onModificationSubmit();
    expect(mockService.modifyEmployee).toHaveBeenCalledWith('1', jasmine.objectContaining({
      email: 'test@test.fr',
      name: 'Test User'
    }));
    expect(component.closeModification.emit).toHaveBeenCalled();
  });

  it('devrait gérer une erreur lors de la modification', () => {
    spyOn(console, 'error');
    mockService.modifyEmployee.and.returnValue(throwError(() => new Error('Erreur modification')));
    component.onModificationSubmit();
    expect(console.error).toHaveBeenCalled();
  });

  it('ne fait rien si user est indéfini', () => {
    component.user = undefined as any;
    expect(() => component.onModificationSubmit()).not.toThrow();
    expect(mockService.modifyEmployee).not.toHaveBeenCalled();
  });
});
