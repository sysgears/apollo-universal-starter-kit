import { Component } from '@angular/core';

@Component({
  selector: 'page-not-found',
  template: `
    <section class="text-center mt-4 mb-4">
    <h2>Page not found - 404</h2>
    <ausk-link [to]="'/'">
      <ausk-button>Go to Homepage</ausk-button>
    </ausk-link>
  </section>
  `
})
export default class {}
