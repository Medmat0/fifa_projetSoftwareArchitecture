import {Component, Input} from '@angular/core';
import {User} from '../../../../../../shared/models/user';

@Component({
  selector: 'app-user-description',
  imports: [],
  templateUrl: './user-description.component.html',
  standalone: true,
  styleUrl: './user-description.component.scss'
})
export class UserDescriptionComponent {

  @Input() user!: User;

}
