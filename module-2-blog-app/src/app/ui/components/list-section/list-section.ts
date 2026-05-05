import { Component, input } from '@angular/core';

import { IListSectionModel } from '@models/list-section.model';

@Component({
  selector: 'blog-app-list-section',
  imports: [],
  templateUrl: './list-section.html',
  styleUrl: './list-section.scss',
})
export class ListSection {
  public readonly listSectionData = input.required<IListSectionModel>();
}
