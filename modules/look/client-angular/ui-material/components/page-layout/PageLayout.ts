import { Component } from '@angular/core';

import settings from '../../../../../../settings';

@Component({
  selector: 'page-layout',
  templateUrl: './PageLayout.html',
  styleUrls: ['./PageLayout.scss']
})
export class PageLayoutComponent {
  public appName: string = settings.app.name;
  public currentYear: number = new Date().getFullYear();
}
