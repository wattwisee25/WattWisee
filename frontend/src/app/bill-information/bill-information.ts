import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';


type BillType = 'electricity' | 'oil' | 'lpg';

@Component({
  selector: 'app-bill-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bill-information.html',
  styleUrls: ['./bill-information.css']
})
export class BillInformation implements OnInit {

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
    { key: 'fromLpg', label: 'From', type: 'date' },
    { key: 'toLpg', label: 'To', type: 'date' },
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

  constructor(private http: HttpClient, private route: ActivatedRoute, private location: Location) { }

    goBack(): void {
    this.location.back(); // Torna alla pagina precedente
  }

  ngOnInit() {
    // leggi tipo bolletta dai parametri di route
    this.route.paramMap.subscribe(params => {
      const type = params.get('type') as BillType;
      if (type === 'electricity' || type === 'oil' || type === 'lpg') {
        this.billType = type;

        // leggi buildingId dai query params
        this.route.queryParamMap.subscribe(qParams => {
          const bId = qParams.get('buildingId');
          if (!bId) {
            alert('No building selected!');
            return;
          }
          this.buildingId = bId;
          this.loadBills();
        });
      }
    });
  }

  private initEmptyBill() {
    return { data: {} };
  }

  loadBills() {
    this.http.get(`http://localhost:3000/api/bill/${this.buildingId}/${this.billType}`).subscribe((res: any) => {
      if (res && res.length) {
        this.bills = res.map((b: any) => ({ ...b, data: b.data || {} }));
      } else {
        this.bills = [this.initEmptyBill()];
      }
      this.currentIndex = 0;
      this.currentBill = this.bills[0];
    });
  }

  saveBill() {
    const payload = { ...this.currentBill, data: this.currentBill.data };
    if (this.currentBill._id) {
      this.http.put(`http://localhost:3000/api/bill/${this.buildingId}/${this.billType}`, payload)
        .subscribe(() => alert('Bollette aggiornata!'));
    } else {
      this.http.post(`http://localhost:3000/api/bill/`, { ...payload, buildingId: this.buildingId, type: this.billType })
        .subscribe((res: any) => {
          alert('Bollette salvata!');
          res.data = res.data || {};
          this.bills[this.currentIndex] = res;
        });
    }
  }

  next() {
    if (this.currentIndex < this.bills.length - 1) {
      this.currentIndex++;
      this.currentBill = this.bills[this.currentIndex];
    } else {
      this.bills.push(this.initEmptyBill());
      this.currentIndex++;
      this.currentBill = this.bills[this.currentIndex];
    }
  }

  back() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.currentBill = this.bills[this.currentIndex];
    }
  }

  getIndicator() {
    return `${this.currentIndex + 1} / ${this.bills.length}`;
  }
}
