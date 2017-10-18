import { Component } from '@angular/core';
import '../../../styles/styles.scss';

@Component({
  selector: 'page-not-found',
  template: `
    <section class="text-center mt-4 mb-4">
    <h2>Page not found - 404</h2>
    <a href="/" class="home-link btn btn-primary">Go to Homepage</a>
  </section>
  `
})
export default class {}
