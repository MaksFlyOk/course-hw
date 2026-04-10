import { Component } from '@angular/core';
import { Header } from '@components/header/header';
import { Footer } from '@components/footer/footer';
import { MainPage } from '@pages/main-page/main-page';

@Component({
  selector: 'app-blog-root',
  imports: [Header, Footer, MainPage],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App { }
