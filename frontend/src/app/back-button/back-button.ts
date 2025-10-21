// back-button.component.ts
import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-back-button',
  templateUrl: './back-button.html', 
  styleUrls: ['./back-button.css'],
  standalone: true
})
export class BackButton {
  constructor(private location: Location) {}

  goBack() {
    this.location.back();
  }
}
