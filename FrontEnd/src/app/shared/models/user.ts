import {Reservation} from './reservation';

export enum VehicleType {
  ELECTRIC = "ELECTRIC",
  HYBRID = "HYBRID",
  THERMAL = "THERMAL",
  UNKNOWN = "UNKNOWN"
}

export enum Role {
  MANAGER = "MANAGER",
  EMPLOYEE = "EMPLOYEE",
  SECRETARY = "SECRETARY"
}

export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  role: Role;
  vehicleType: VehicleType;
  reservations?: Reservation[];
}
