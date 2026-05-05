import { Component, input } from '@angular/core';

import { IAchievementElement } from '@models/achievements';

@Component({
  selector: 'blog-app-achievements',
  imports: [],
  templateUrl: './achievements.html',
  styleUrl: './achievements.scss',
})
export class Achievements {
  public readonly achievementsData = input.required<IAchievementElement[]>();
}
