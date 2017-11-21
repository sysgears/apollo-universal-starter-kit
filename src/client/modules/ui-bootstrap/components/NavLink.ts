import { Component, Input, OnInit } from '@angular/core';

export enum LinkType {
  HREF = 'href',
  BRAND = 'brand',
  ROUTER = 'router',
  ROUTER_GROUP = 'routerGroup',
  CLICKABLE = 'clickable'
}

const linkTypes = [
  {
    type: LinkType.HREF,
    className: 'nav-link'
  },
  {
    type: LinkType.BRAND,
    className: 'navbar-brand'
  },
  {
    type: LinkType.ROUTER,
    className: 'nav-link'
  },
  {
    type: LinkType.ROUTER_GROUP,
    className: ''
  },
  {
    type: LinkType.CLICKABLE,
    className: 'nav-link'
  }
];

@Component({
  selector: 'nav-link',
  template: `
      <a *ngIf="isRouterLink()" class="{{ className }}"
         routerLinkActive="active"
         routerLink="{{ to }}">
          {{ name }}
      </a>
      <a *ngIf="currentLinkType.type == 'href'"
         class="{{ className }}"
         href="{{ to }}">
          {{ name }}
      </a>
      <a *ngIf="currentLinkType.type == 'clickable'"
         class="{{ className }}"
         href="#" (click)="onClick()">
          {{ name }}
      </a>
	`
})
export default class NavLink implements OnInit {
  @Input() public name: string;
  @Input() public type: string;
  @Input() public to: string;
  @Input() public onClick: any;
  public className: string;
  public currentLinkType: any;

  public ngOnInit(): void {
    this.currentLinkType = linkTypes.find((linkType: any) => linkType.type === this.type);
    if (this.className === undefined) {
      this.className = this.currentLinkType.className;
    }
  }

  public isRouterLink() {
    const type = this.currentLinkType.type;
    return type === LinkType.BRAND || type === LinkType.ROUTER || type === LinkType.ROUTER_GROUP;
  }
}
