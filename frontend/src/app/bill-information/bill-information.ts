import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { BackButton } from "../back-button/back-button";

type BillType = 'electricity' | 'oil' | 'lpg';

@Component({
  selector: 'app-bill-form',
  standalone: true,
  imports: [CommonModule, FormsModule, BackButton],
  templateUrl: './bill-information.html',
  styleUrls: ['./bill-information.css']
})
export class BillInformation implements OnInit, OnDestroy {

  electricityFields = [
    { key: 'mprn', label: 'MPRN number', type: 'text' },
    { key: 'mic', label: 'Maximum import capacity (MIC)', type: 'text' },
    { key: 'fromDate', label: 'From', type: 'date' },
    { key: 'toDate', label: 'To', type: 'date' },
    { key: 'dayRate', label: 'Day rate', type: 'number' },
    { key: 'nightRate', label: 'Night rate', type: 'number' },
    { key: 'kwhDay', label: 'kWh (day)', type: 'number' },
    { key: 'kwhNight', label: 'kWh (night)', type: 'number' },
    { key: 'grossCost1', label: 'Gross cost*', type: 'number' },
    { key: 'grossCost2', label: 'Gross cost*', type: 'number' },
    { key: 'totalCost', label: 'Total cost', type: 'number' },
    { key: 'bill', label: 'Upload your file', type: 'file' }
  ];

  oilFields = [
    { key: 'deliveryDate', label: 'Delivery date', type: 'date' },
    { key: 'quantityLiters', label: 'Quantity liters', type: 'number' },
    { key: 'costLiter', label: 'Cost/liter', type: 'number' },
    { key: 'kwhEquivalent', label: 'kWh equivalent', type: 'number' },
    { key: 'tonnesCarbon', label: 'Tonnes of carbon equivalent', type: 'number' },
    { key: 'grossCostOil', label: 'Gross cost*', type: 'number' },
    { key: 'bill', label: 'Upload your file', type: 'file' }
  ];

  lpgFields = [
    { key: 'gprn', label: 'GPRN meter number', type: 'text' },
    { key: 'meterNumber', label: 'Meter number', type: 'text' },
    { key: 'fromDate', label: 'From', type: 'date' },
    { key: 'toDate', label: 'To', type: 'date' },
    { key: 'rate', label: 'Rate', type: 'number' },
    { key: 'cubicMeters', label: 'Cubic meters', type: 'number' },
    { key: 'grossCostLpg', label: 'Gross cost*', type: 'number' },
    { key: 'totalCostLpg', label: 'Total cost', type: 'number' },
    { key: 'bill', label: 'Upload your file', type: 'file' }
  ];

  billType: BillType = 'electricity';
  buildingId: string = '';
  bills: any[] = [];
  currentIndex: number = 0;
  currentBill: any = { data: {} };
  autosaveInterval: any;
  editingBillId: string | null = null;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const type = params.get('type') as BillType;
      if (!type) return console.error('Bill type missing in route!');
      this.billType = type;

      this.route.queryParamMap.subscribe(qParams => {
        const bId = qParams.get('buildingId');
        if (!bId) return alert('No building selected!');
        this.buildingId = bId;

        const billId = qParams.get('billId');
        if (billId) {
          this.loadSingleBill(billId);
        } else {
          this.loadDraft();
        }
      });
    });

    this.autosaveInterval = setInterval(() => this.autosave(), 30000);
  }

  ngOnDestroy() {
    if (this.autosaveInterval) clearInterval(this.autosaveInterval);
  }

  getFields() {
    return this.billType === 'electricity'
      ? this.electricityFields
      : this.billType === 'oil'
      ? this.oilFields
      : this.lpgFields;
  }

  private initEmptyBill() { return { data: {} }; }

  // --- Load draft ---
  loadDraft() {
    const saved = localStorage.getItem(this.getDraftKey());
    this.bills = saved ? [JSON.parse(saved)] : [this.initEmptyBill()];
    this.currentIndex = 0;
    this.currentBill = this.bills[0];
    this.editingBillId = null;
  }

  getDraftKey() { return `draft_${this.buildingId}_${this.billType}`; }

  // --- Load single bill for editing ---
  loadSingleBill(billId: string) {
    this.http.get(`http://localhost:3000/api/bill/id/${billId}`).subscribe({
      next: (bill: any) => {
        this.bills = [bill];
        this.currentIndex = 0;
        this.currentBill = bill;
        this.editingBillId = bill._id || billId;
      },
      error: err => {
        console.error('Error loading bill:', err);
        alert('Error loading bill! Fallback su draft.');
        this.loadDraft();
      }
    });
  }

  // --- File upload ---
  onFileSelected(event: any, fieldKey: string) {
    if (event.target.files && event.target.files.length > 0) {
      this.currentBill.data[fieldKey] = event.target.files[0];
    }
  }

  // --- Save ---
  saveBill() {
    const formData = new FormData();
    formData.append('buildingId', this.buildingId);
    formData.append('type', this.billType);

    const dataCopy: any = { ...this.currentBill.data };
    if (this.editingBillId) dataCopy._id = this.editingBillId;

    // aggiunge i file
    for (const key in dataCopy) {
      if (dataCopy[key] instanceof File) {
        formData.append(key, dataCopy[key]);
        delete dataCopy[key];
      }
    }

    formData.append('data', JSON.stringify(dataCopy));

    this.http.post(`http://localhost:3000/api/bill/`, formData).subscribe({
      next: (res: any) => {
        alert('Bolletta salvata!');
        localStorage.removeItem(this.getDraftKey());

        if (!this.editingBillId && res._id) {
          this.editingBillId = res._id;
          this.currentBill._id = res._id;
        }
      },
      error: err => {
        console.error('Errore salvataggio:', err);
        alert('Errore durante il salvataggio!');
      }
    });
  }

  next() {
    const newBill = this.initEmptyBill();
    this.bills.push(newBill);
    this.currentIndex = this.bills.length - 1;
    this.currentBill = newBill;
    this.editingBillId = null;
  }

  back() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.currentBill = this.bills[this.currentIndex];
      this.editingBillId = this.currentBill._id || null;
    }
  }

  getIndicator() {
    return `${this.currentIndex + 1} / ${this.bills.length}`;
  }

  isCurrentBillEmpty() {
    if (!this.currentBill || !this.currentBill.data) return true;
    return Object.values(this.currentBill.data).every(
      v => v === null || v === '' || v === undefined
    );
  }

  autosave() {
    if (!this.isCurrentBillEmpty()) {
      localStorage.setItem(this.getDraftKey(), JSON.stringify(this.currentBill));
      console.log('Autosaved draft at', new Date().toLocaleTimeString());
    }
  }

  goBack(): void {
    localStorage.removeItem(this.getDraftKey());
    this.location.back();
  }
}
