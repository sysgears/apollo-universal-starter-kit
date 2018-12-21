import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material';

import { Button } from './components';

export { default as styles } from './styles/styles.scss';

@NgModule({
  imports: [CommonModule, BrowserAnimationsModule, MatButtonModule],
  declarations: [Button],
  exports: [Button]
})
export class MaterialModule {}
