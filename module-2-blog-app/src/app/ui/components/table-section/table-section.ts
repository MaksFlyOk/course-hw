import { Component, input } from '@angular/core';

import { ITableSectionModel } from '@models/table-section.model';

@Component({
  selector: 'blog-app-table-section',
  imports: [],
  templateUrl: './table-section.html',
  styleUrl: './table-section.scss',
})
export class TableSection {
  public readonly tableSectionData = input.required<ITableSectionModel>();
}
