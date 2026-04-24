export interface TableElement {
  readonly title: string;
  readonly subtitle: string;
}

export interface TableSectionModel {
  readonly title: string;
  readonly list: TableElement[];
}
