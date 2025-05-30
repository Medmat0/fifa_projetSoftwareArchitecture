import {Reservation} from '../reservation';
import {Role, VehicleType} from '../user';

export interface UserDTO {
  email: string;
  name: string;
  password: string;
  role: Role;
  vehicleType: VehicleType;
  reservations?: Reservation[];
}
