export interface ITableElement {
  readonly title: string;
  readonly subtitle: string;
}

export interface ITableSectionModel {
  readonly title: string;
  readonly list: ITableElement[];
}
