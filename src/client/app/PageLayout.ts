import { Component } from '@angular/core';
import '../modules/ui-bootstrap/styles/styles.scss';

@Component({
  selector: 'page-layout',
  template: `<section>
    <nav-bar></nav-bar>
    <router-outlet></router-outlet>
    <footer class="footer"><div class="text-center">&copy; 2017. Example Apollo App.</div></footer>
  </section>`
})
export default class {}
