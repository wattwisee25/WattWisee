import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Menu } from '../menu/menu';
import { BackButton } from '../back-button/back-button';
import { UserService } from '../user.service';

export interface Item {
  term: string;
  data: string;
}

export interface Supplier {
  id: string;
  name: string;
}

@Component({
  selector: 'app-actions',
  standalone: true,
  imports: [Menu, BackButton, CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './actions.html',
  styleUrls: ['./actions.css']
})
export class Actions implements OnInit {

  items: Item[] = [
    { term: 'Energy savings (KWh/yr)', data: '' },
    { term: 'Savings (€/yr)', data: '' },
    { term: 'Emission reduction (t CO2e)', data: '' },
    { term: 'Estimated cost of action(€)', data: '' },
    { term: 'Payback period (yrs)', data: '' },
    { term: 'Comments', data: '' },
  ];

  term: string = '';
  suppliers: Supplier[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    // Recupera il parametro "term" dalla route
    this.route.paramMap.subscribe(params => {
      const termParam = params.get('term');
      if (termParam) {
        this.term = decodeURIComponent(termParam);
      }
    });

    // Carica i fornitori dal backend
    this.userService.getSuppliers().subscribe({
      next: (users) => {
        // Salva i fornitori con id come stringa
        this.suppliers = users.map(user => ({ id: user._id.toString(), name: user.company_name }));
        localStorage.setItem('suppliers', JSON.stringify(this.suppliers));

        // Carica subito gli uploads filtrati
        this.loadUploads();
      },
      error: (err) => console.error('Errore caricamento fornitori', err)
    });
  }

  loadUploads(): void {
    const suppliers = JSON.parse(localStorage.getItem('suppliers') || '[]') as Supplier[];
    const supplierIds = suppliers.map(s => s.id);

    const selectedAction = localStorage.getItem('selectedAction') || '';
    const selectedRecommended = localStorage.getItem('selectedRecommended') || '';

    if (!supplierIds.length) return;

    // Chiamata GET all'endpoint di filtro uploads
    this.http.get<any[]>(`http://localhost:3000/api/uploads/filter?ids=${supplierIds.join(',')}&action=${encodeURIComponent(selectedAction)}&term=${encodeURIComponent(selectedRecommended)}`)
      .subscribe({
        next: (uploads) => {
          console.log('Uploads filtrati:', uploads);

          // Popola gli items con i dati del primo upload (modifica se vuoi gestire più uploads)
          if (uploads.length > 0) {
            const upload = uploads[0];
            this.items = [
              { term: 'Energy savings (KWh/yr)', data: upload.energySavings || '' },
              { term: 'Savings (€/yr)', data: upload.costSavings || '' },
              { term: 'Emission reduction (t CO2e)', data: upload.emissionReduction || '' },
              { term: 'Estimated cost of action(€)', data: upload.costWork || '' },
              { term: 'Payback period (yrs)', data: upload.paybackPeriod || '' },
              { term: 'Comments', data: upload.notes || '' },
            ];
          }
        },
        error: (err) => console.error('Errore caricamento uploads', err)
      });
  }
}
