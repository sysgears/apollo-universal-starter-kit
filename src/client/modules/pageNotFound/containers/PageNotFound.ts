import { Component } from '@angular/core';
import '../../../modules/ui-bootstrap/styles/styles.scss';

@Component({
  selector: 'page-not-found',
  template: `
    <section class="text-center mt-4 mb-4">
    <h2>Page not found - 404</h2>
    <ausk-link [to]="'/'">
      <button class="btn btn-primary">Go to Homepage</button></ausk-link>
  </section>
  `
})
export default class {}
