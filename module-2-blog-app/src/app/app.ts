import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Footer } from '@components/layout/footer/footer';
import { Header } from '@components/layout/header/header';

@Component({
  selector: 'app-blog-root',
  imports: [Header, Footer, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
