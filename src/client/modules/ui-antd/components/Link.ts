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
    className: 'nav-link'
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
  selector: 'ausk-link',
  template: `
    <a class="{{ className }}"
       [id]="id ? id : ''"
       [routerLinkActive]="isRouterLink() ? 'active' : ''"
       [routerLink]="isRouterLink() ? to : ''"
       (click)="onClickFunction()">
      <ng-content></ng-content>
    </a>
  `
})
export default class Link implements OnInit {
  @Input() public id: string;
  @Input() public className: string;
  @Input() public to: string;
  @Input() public type: string = 'router';
  @Input() public content: any;
  @Input() public navLink: boolean = false;
  public currentLinkType: any;

  public ngOnInit(): void {
    this.currentLinkType = linkTypes.find((linkType: any) => linkType.type === this.type);
    if (this.currentLinkType && this.navLink && !this.className) {
      this.className = this.currentLinkType.className;
    }
  }

  public onClickFunction() {
    if (this.type === LinkType.HREF) {
      window.location.href = this.to;
    }
  }

  public isRouterLink() {
    const type = this.currentLinkType.type;
    return type === LinkType.BRAND || type === LinkType.ROUTER || type === LinkType.ROUTER_GROUP;
  }
}
