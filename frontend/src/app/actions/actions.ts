import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Menu } from '../menu/menu';
import { BackButton } from '../back-button/back-button';

@Component({
  selector: 'app-actions',
  standalone: true,
  imports: [Menu, BackButton,  CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './actions.html',
  styleUrl: './actions.css'
})
export class Actions implements OnInit {
    term: string = '';

    constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient
  ) {}

    ngOnInit(): void {
    // Recupera il parametro "term" dalla route
    this.route.paramMap.subscribe(params => {
      const termParam = params.get('term');
      if (termParam) {
        this.term = decodeURIComponent(termParam);
      }
    });
  }

}
