import { Component } from '@angular/core';

@Component({
  selector: 'layout-center',
  template: `
     <container class="d-flex">
       <row [justifyContent]="'center'" [classNames]="'d-flex flex-row align-items-center'">
         <div style="flex-grow: 3"></div>
         <div style="flex-grow: 3">
           <column class="d-flex flex-column justify-content-center">
             <ng-content></ng-content>
           </column>
         </div>
         <div style="flex-grow: 3"></div>
       </row>
     </container>
	`
})
export default class LayoutCenter {}
