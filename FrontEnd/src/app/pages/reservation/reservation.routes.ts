<<<<<<< Updated upstream

import { Routes } from '@angular/router';
import {ReservationMapComponent} from './components/reservation-map/reservation-map.component';
import {ConnectedGuard} from '../../shared/guards/connected.guard';

export default [
  {path: '', component:ReservationMapComponent, canActivate: [ConnectedGuard]},
  ] as Routes;

=======
import { Routes } from '@angular/router';
import { ReservationMapComponent } from './components/reservation-map/reservation-map.component';

export const RESERVATION_ROUTES: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: ReservationMapComponent,
                title: 'Parking Reservation'
            }
        ]
    }
];
>>>>>>> Stashed changes
