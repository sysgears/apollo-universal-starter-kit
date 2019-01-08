import { Component } from '@angular/core';
import settings from '../../../../../../settings';

@Component({
  selector: 'navbar',
  templateUrl: './Navbar.html',
  styleUrls: ['./Navbar.scss']
})
export class NavbarComponent {
  public appName: string = settings.app.name;
}
