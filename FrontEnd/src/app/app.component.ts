import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template:`
    <main>
      <router-outlet></router-outlet>
    </main>
  `,
  standalone: true,
  styles:[]
})
export class AppComponent {
  title = 'SpotReservation';
}
