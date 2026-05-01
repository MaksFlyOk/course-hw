export enum HeaderLinkTypes {
  Page = 'page',
  Anchor = 'anchor',
}

export interface HeaderPageLink {
  type: HeaderLinkTypes.Page;
  routerLink: string;
  ariaLabel: string;
  dataText: string;
}

export interface HeaderAnchorLink {
  type: HeaderLinkTypes.Anchor;
  fragment: string;
  ariaLabel: string;
  dataText: string;
}
