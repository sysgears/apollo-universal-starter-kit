import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatToolbarModule, MATERIAL_SANITY_CHECKS } from '@angular/material';

import { ButtonComponent, ButtonRaisedComponent, PageLayoutComponent, NavbarComponent } from './components';
import { RouterModule } from '@angular/router';

export { default as styles } from './styles/styles.scss';
export { onAppCreate } from './components';

@NgModule({
  imports: [CommonModule, BrowserAnimationsModule, MatButtonModule, MatToolbarModule, RouterModule],
  declarations: [ButtonComponent, ButtonRaisedComponent, PageLayoutComponent, NavbarComponent],
  exports: [ButtonComponent, ButtonRaisedComponent, PageLayoutComponent, NavbarComponent],
  // Workaround for a dynamic loaded styles https://github.com/angular/material2/issues/4125#issuecomment-347139081
  providers: [{ provide: MATERIAL_SANITY_CHECKS, useValue: false }]
})
export class MaterialModule {}
