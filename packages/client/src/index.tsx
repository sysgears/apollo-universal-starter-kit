import { ApplicationRef, NgModule, Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

// Virtual module, generated in-memory by spinjs, contains count of backend rebuilds
// tslint:disable-next-line
import 'backend_reload';

@Component({
  selector: 'body div:first-child',
  template: '<h1>Hello, {{name}}</h1>'
})
export class AppComponent {
  private name = 'Angular';
}

@NgModule({
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  imports: [BrowserModule],
  providers: []
})
class MainModule {
  constructor(public appRef: ApplicationRef) {}
}

platformBrowserDynamic().bootstrapModule(MainModule);
