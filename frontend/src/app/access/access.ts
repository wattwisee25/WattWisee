import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-access',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './access.html',
  styleUrl: './access.css'
})
export class AccessComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit(): void {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      // se esiste un'email ricordata, vai direttamente alla pagina glossary
      this.router.navigate(['/home']);
    }
  }
}
