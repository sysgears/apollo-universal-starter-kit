import { Component } from '@angular/core';
import '../styles/styles.scss';

@Component({
  selector: 'page-layout',
  template: `<section>
    <nav-bar></nav-bar>
    <container>
        <router-outlet></router-outlet>
    </container>
    <footer class="footer"><div class="text-center">&copy; 2017. Example Apollo App.</div></footer>
  </section>`
})
export default class {}
