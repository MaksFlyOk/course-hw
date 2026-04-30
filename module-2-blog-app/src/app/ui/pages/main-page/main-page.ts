import { Component } from '@angular/core';

import { AboutMe } from '@components/about-me/about-me';
import { Achievements } from '@components/achievements/achievements';
import { LastArticles } from '@components/last-articles/last-articles';
import { ListSection } from '@components/list-section/list-section';
import { TableSection } from '@components/table-section/table-section';
import { achievementsData } from '@pages/main-page/sections-data/achievements.data';

import { carrierListData } from './sections-data/carrier-list.data';
import { courseTableData } from './sections-data/course-table.data';
import { skillsTableData } from './sections-data/skills-table.data';
import { uniListData } from './sections-data/uni-list.data';

@Component({
  selector: 'app-blog-main-page',
  imports: [ListSection, TableSection, LastArticles, AboutMe, Achievements],
  templateUrl: './main-page.html',
  styleUrl: './main-page.scss',
})
export class MainPage {
  protected readonly carrierListData = carrierListData;
  protected readonly uniListData = uniListData;
  protected readonly courseTableData = courseTableData;
  protected readonly skillsTableData = skillsTableData;
  protected readonly achievementsData = achievementsData;
}
