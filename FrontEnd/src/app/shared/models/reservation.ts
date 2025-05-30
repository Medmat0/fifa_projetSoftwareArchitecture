import { User } from "./user";
import {ParkingSlot} from './parkingslot';

export interface Reservation {
  id: string;
  userId: string;
  slotId: string;
  startDate: Date;
  endDate: Date;
  halfDay: boolean; // true = après-midi, false = matin
  checkInTime?: Date;
  createdAt: Date;
  user?: User;
  slot?: ParkingSlot;
}
