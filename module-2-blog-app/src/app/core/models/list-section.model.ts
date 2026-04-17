interface ListElement {
  readonly title: string;
  readonly subtitle: string;
  readonly description: string;
  readonly img: {
    readonly src: string;
    readonly alt: string;
  };
}

export interface ListSectionModel {
  readonly title: string;
  readonly description: string;
  readonly list: readonly ListElement[];
}
