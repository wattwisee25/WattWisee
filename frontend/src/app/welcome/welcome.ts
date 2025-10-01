import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.html',
  styleUrls: ['./welcome.css']
})
export class WelcomeComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Redirect after 3 seconds
    setTimeout(() => {
      this.router.navigate(['/create-new-project']);
    }, 2000); // 2 seconds
  }
}
