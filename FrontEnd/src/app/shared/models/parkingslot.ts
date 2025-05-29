import {Reservation} from './reservation';

export interface ParkingSlot {
  id: string;
  row: string;
  number: number;
  isElectric: boolean;
  reservations?: Reservation[];
}
