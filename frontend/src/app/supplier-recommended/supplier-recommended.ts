import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SupplierMenu } from '../supplier-menu/supplier-menu';

interface Action {
  title: string;
  icon: SafeHtml;
  description?: string;
}

@Component({
  selector: 'app-supplier-recommended',
  standalone: true,
  imports: [CommonModule, SupplierMenu],
  templateUrl: './supplier-recommended.html',
  styleUrls: ['./supplier-recommended.css']
})
export class SupplierRecommended implements OnInit {

  term: string = '';
  allActions: Record<string, Action[]> = {};
  actions: Action[] = [];

  constructor(private route: ActivatedRoute, private sanitizer: DomSanitizer, private router: Router) {
    // Definisco le actions con icone
    this.allActions = {
      'Building Envelope': [
        {
          title: 'Upgrade walls',
          icon: this.sanitizer.bypassSecurityTrustHtml(`
            <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-wall"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z" /><path d="M4 8h16" /><path d="M20 12h-16" /><path d="M4 16h16" /><path d="M9 4v4" /><path d="M14 8v4" /><path d="M8 12v4" /><path d="M16 12v4" /><path d="M11 16v4" /></svg>
          `)
        },
        {
          title: 'Upgrade windows',
          icon: this.sanitizer.bypassSecurityTrustHtml(`
            <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-window"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 3c-3.866 0 -7 3.272 -7 7v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1 -1v-10c0 -3.728 -3.134 -7 -7 -7z" /><path d="M5 13l14 0" /><path d="M12 3l0 18" /></svg>
          `)
        },
        {
          title: 'Upgrade roofs',
          icon: this.sanitizer.bypassSecurityTrustHtml(`
           <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-home-spark"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 12h-2l9 -9l9 9h-2" /><path d="M5 12v7a2 2 0 0 0 2 2h5" /><path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2" /><path d="M19 22.5a4.75 4.75 0 0 1 3.5 -3.5a4.75 4.75 0 0 1 -3.5 -3.5a4.75 4.75 0 0 1 -3.5 3.5a4.75 4.75 0 0 1 3.5 3.5" /></svg>
          `)
        }
      ],
      'Heating': [
        {
          title: 'Service boiler',
          icon: this.sanitizer.bypassSecurityTrustHtml(`
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
              <path d="M12 10.941c2.333 -3.308 .167 -7.823 -1 -8.941" />
            </svg>
          `)
        },
        {
          title: 'Optimize radiators',
          icon: this.sanitizer.bypassSecurityTrustHtml(`
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
              <path d="M14 8h1" />
            </svg>
          `)
        }
      ],
      'Lighting': [
        {
          title: 'Replace bulbs with LEDs',
          icon: this.sanitizer.bypassSecurityTrustHtml(`
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
              <path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
            </svg>
          `)
        },
        {
          title: 'Install motion sensors',
          icon: this.sanitizer.bypassSecurityTrustHtml(`
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
              <path d="M3 12h1m8 -9v1m8 8h1m-9 8v1" />
            </svg>
          `)
        }
      ],
      'Renewables': [
        {
          title: 'Inspect solar panels',
          icon: this.sanitizer.bypassSecurityTrustHtml(`
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
              <path d="M8 12a4 4 0 0 0 4 4m0 -8a4 4 0 0 0 -4 4" />
            </svg>
          `)
        },
        {
          title: 'Check inverter',
          icon: this.sanitizer.bypassSecurityTrustHtml(`
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
              <path d="M20 7l-3 5h4l-3 5" />
            </svg>
          `)
        }
      ]
    };
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const termParam = params.get('term');
      if (termParam) {
        this.term = decodeURIComponent(termParam);
        this.actions = this.allActions[this.term] || [];
      }
    });
  }

  
  goToItem(term: string) {
    const encodedTerm = encodeURIComponent(term);
    this.router.navigate(['/upload', encodedTerm]);
  }
}
