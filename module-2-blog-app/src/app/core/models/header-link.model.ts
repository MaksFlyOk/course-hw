export enum HeaderLinkTypes {
  Page = 'page',
  Anchor = 'anchor',
}

export interface IHeaderPageLink {
  type: HeaderLinkTypes.Page;
  routerLink: string;
  ariaLabel: string;
  dataText: string;
}

export interface IHeaderAnchorLink {
  type: HeaderLinkTypes.Anchor;
  fragment: string;
  ariaLabel: string;
  dataText: string;
}
