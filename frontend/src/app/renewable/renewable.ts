import { Component } from '@angular/core';
import { Menu } from "../menu/menu";
import { BackButton } from "../back-button/back-button";

@Component({
  selector: 'app-renewable',
  imports: [Menu, BackButton],
  templateUrl: './renewable.html',
  styleUrl: './renewable.css'
})
export class Renewable {

}
