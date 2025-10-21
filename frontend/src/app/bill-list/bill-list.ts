import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Menu } from "../menu/menu";
import { BackButton } from "../back-button/back-button";

@Component({
  selector: 'app-bill-list',
  standalone: true,
  imports: [CommonModule, Menu, BackButton],
  templateUrl: './bill-list.html',
  styleUrls: ['./bill-list.css']
})
export class BillList implements OnInit {

  buildingId = '';
  type: 'electricity' | 'oil' | 'lpg' = 'electricity';
  bills: any[] = [];
  billsByMonth: { [month: string]: any[] } = {};

  months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      const typeParam = params.get('type') as 'electricity' | 'oil' | 'lpg';

      if (!id || !typeParam) {
        console.error('Missing buildingId or type in URL');
        return;
      }

      this.buildingId = id;
      this.type = typeParam;
      this.loadBills();
    });
  }

  // Metodo per aprire PDF in una nuova finestra
  viewPdf(filePath: string) {
    if (!filePath) return;
    const url = `http://localhost:3000/${filePath}`;
    window.open(url, '_blank');
  }

  selectedBill: any = null;

openBillDetails(bill: any) {
  this.selectedBill = bill;
}

closeModal() {
  this.selectedBill = null;
}


  // Carica tutte le bollette del building e tipo
  loadBills() {
    this.http.get(`http://localhost:3000/api/bill/${this.buildingId}/${this.type}`)
      .subscribe({
        next: (data: any) => {
          this.bills = data || [];
          this.groupBillsByMonth();
        },
        error: (err) => console.error('Error loading bills:', err)
      });
  }

  // Raggruppa le bollette per mese
  groupBillsByMonth() {
    this.billsByMonth = {};
    this.months.forEach(month => this.billsByMonth[month] = []);

    this.bills.forEach(bill => {
      // Prendi la data principale a seconda del tipo di bolletta
      const fromDate = bill.data?.fromDate || bill.data?.deliveryDate || bill.data?.fromLpg;
      if (!fromDate) return;

      const date = new Date(fromDate);
      if (isNaN(date.getTime())) return;

      const monthName = this.months[date.getMonth()];
      this.billsByMonth[monthName].push(bill);
    });
  }

  // Elimina una bolletta
  deleteBill(id?: string) {
    if (!id) return console.warn('Cannot delete: id is undefined');

    this.http.delete(`http://localhost:3000/api/bill/${id}`)
      .subscribe({
        next: () => this.loadBills(),
        error: (err) => console.error('Error deleting bill:', err)
      });
  }
}
