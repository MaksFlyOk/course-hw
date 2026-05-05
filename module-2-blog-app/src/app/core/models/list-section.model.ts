export interface IListElement {
  readonly title: string;
  readonly subtitle: string;
  readonly description: string;
  readonly img: {
    readonly src: string;
    readonly alt: string;
  };
}

export interface IListSectionModel {
  readonly title: string;
  readonly description: string;
  readonly list: readonly IListElement[];
}
