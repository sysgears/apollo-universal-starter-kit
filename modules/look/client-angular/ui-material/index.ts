import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MATERIAL_SANITY_CHECKS } from '@angular/material';

import { ButtonComponent } from './components';

export { default as styles } from './styles/styles.scss';

@NgModule({
  imports: [CommonModule, BrowserAnimationsModule, MatButtonModule],
  declarations: [ButtonComponent],
  exports: [ButtonComponent],
  // Workaround for a dynamic loaded styles https://github.com/angular/material2/issues/4125#issuecomment-347139081
  providers: [{ provide: MATERIAL_SANITY_CHECKS, useValue: false }]
})
export class MaterialModule {}
