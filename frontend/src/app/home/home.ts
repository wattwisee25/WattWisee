import { Component } from '@angular/core';
import { Menu } from "../menu/menu";
import { BackButton } from "../back-button/back-button";

@Component({
  selector: 'app-home',
  imports: [Menu, BackButton],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

}
