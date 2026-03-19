import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './component/navbar/navbar';
import { HeaderComponent } from './component/header-component/header-component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
