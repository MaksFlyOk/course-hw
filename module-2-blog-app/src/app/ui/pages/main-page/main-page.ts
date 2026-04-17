import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { ListSection } from '@components/list-section/list-section';
import { Button } from '@components/shared/button/button';
import { ButtonType, ButtonVariant } from '@components/shared/button/button.type';
import { TableSection } from '@components/table-section/table-section';

import { carrierListData } from './sections-data/carrier-list.data';
import { courseTableData } from './sections-data/course-table.data';
import { skillsTableData } from './sections-data/skills-table.data';
import { uniListData } from './sections-data/uni-list.data';

@Component({
  selector: 'app-blog-main-page',
  imports: [ListSection, TableSection, Button, RouterLink],
  templateUrl: './main-page.html',
  styleUrl: './main-page.scss',
})
export class MainPage {
  protected router = inject(Router);

  protected readonly carrierListData = carrierListData;
  protected readonly uniListData = uniListData;
  protected readonly courseTableData = courseTableData;
  protected readonly skillsTableData = skillsTableData;

  protected readonly buttonVariant = ButtonVariant;
}
