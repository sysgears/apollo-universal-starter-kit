import { Component } from '@angular/core';

import settings from '../../../../../../settings';

@Component({
  selector: 'page-layout',
  templateUrl: './PageLayout.html',
  styleUrls: ['./PageLayout.scss']
})
export class PageLayoutComponent {
  public appName = settings.app.name;
  public currentYear = new Date().getFullYear();
}
