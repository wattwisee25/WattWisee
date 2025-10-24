// back-button.component.ts
import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';

@Component({
  selector: 'app-back-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './back-button.html', 
  styleUrls: ['./back-button.css'],
})
export class BackButton {
  constructor(private location: Location) {}

  goBack() {
    this.location.back();
  }
}
