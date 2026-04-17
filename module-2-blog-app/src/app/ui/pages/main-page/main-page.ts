import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LastArticles } from '@components/last-articles/last-articles';
import { ListSection } from '@components/list-section/list-section';
import { TableSection } from '@components/table-section/table-section';

import { carrierListData } from './sections-data/carrier-list.data';
import { courseTableData } from './sections-data/course-table.data';
import { skillsTableData } from './sections-data/skills-table.data';
import { uniListData } from './sections-data/uni-list.data';

@Component({
  selector: 'app-blog-main-page',
  imports: [ListSection, TableSection, RouterLink, LastArticles],
  templateUrl: './main-page.html',
  styleUrl: './main-page.scss',
})
export class MainPage {
  protected readonly carrierListData = carrierListData;
  protected readonly uniListData = uniListData;
  protected readonly courseTableData = courseTableData;
  protected readonly skillsTableData = skillsTableData;
}
