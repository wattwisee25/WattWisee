import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SupplierMenu } from '../supplier-menu/supplier-menu';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../enviroments/enviroments';

@Component({
  selector: 'app-supplier-upload',
  standalone: true,
  imports: [SupplierMenu, CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './supplier-upload.html',
  styleUrl: './supplier-upload.css'
})
export class SupplierUpload implements OnInit {

  term: string = '';
  uploadForm!: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';

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

    // Inizializza il form
    this.uploadForm = this.fb.group({
      costWork: [''],
      costSavings: [''],
      emissionReduction: [''],
      paybackPeriod: [''],
      size: [''],
      warrantyHardware: [''],
      warrantyLabour: [''],
      multipleItems: [''],
      installationDate: [''],
      installationTime: [''],
      requirements: [''],
      notes: ['']
    });
  }

onSubmit(): void {
  const supplierId = localStorage.getItem('supplierId') || '';
  const macroCategory = localStorage.getItem('selectedAction') || '';

  if (!supplierId) {
    alert('Supplier not logged in!');
    return;
  }

  // Converte installationDate in Date
  const installationDate = this.uploadForm.value.installationDate
    ? new Date(this.uploadForm.value.installationDate)
    : null;

  // Costruisci payload
  const payload = {
    supplierId,
    macroCategory,
    term: this.term,
    action: 'create',
    ...this.uploadForm.value,
    installationDate,                 // Date correttamente formattata
    installationTime: this.uploadForm.value.installationTime || ''
  };

  this.http.post('${environment.apiUrl}/api/uploads', payload)
    .subscribe({
      next: (res: any) => {
        console.log('Upload saved:', res);
        this.successMessage = 'Upload saved successfully!';
        this.errorMessage = '';
        this.uploadForm.reset();
      },
      error: (err) => {
        console.error('Error saving upload:', err);
        this.errorMessage = 'Error saving upload.';
        this.successMessage = '';
      }
    });
}

}
