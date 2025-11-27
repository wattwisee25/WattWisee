import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
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
export class BillList implements OnInit, AfterViewInit {

  @ViewChild('grid') grid!: ElementRef<HTMLDivElement>;

  buildingId = '';
  type: 'electricity' | 'oil' | 'lpg' = 'electricity';
  bills: any[] = [];
  billsByMonth: { [month: string]: any[] } = {};
  months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  selectedYear: number = new Date().getFullYear();
  selectedBill: any = null;
  totalYearCost: number = 0;

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      const typeParam = params.get('type') as 'electricity' | 'oil' | 'lpg';

      if (!id || !typeParam) return;

      this.buildingId = id;
      this.type = typeParam;
      this.loadBills();
    });

  }

  ngAfterViewInit() {
    this.updateGridPosition();
  }

  loadBills() {
    this.http.get(`http://localhost:3000/api/bill/${this.buildingId}/${this.type}`)
      .subscribe({
        next: (data: any) => {
          this.bills = data || [];
          this.groupBillsByMonth();
          this.updateGridPosition();
        },
        error: (err) => console.error('Error loading bills:', err)
      });
  }

  editBill(billId: string) {
    const buildingId = localStorage.getItem('selectedBuildingId');
    if (!buildingId) {
      return alert('No building selected!');
    }

    // Naviga alla pagina bill-information, con type, buildingId e billId
    this.router.navigate(
      ['/bill-information', this.type],
      { queryParams: { buildingId: buildingId, billId: billId } }
    );
  }

  scrollYears(direction: 'left' | 'right') {
    const container = document.querySelector('.three-year-grid-wrapper') as HTMLElement;
    const scrollAmount = 320; // larghezza approssimativa di una colonna + gap
    if (direction === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }



  getTotalByYear(year: number): number {
    let total = 0;
    const bills = this.getBillsByYear(year);
    for (const b of bills) {
      if (b.type === 'electricity') total += +b.data.totalCost || 0;
      if (b.type === 'oil') total += +b.data.grossCostOil || 0;
      if (b.type === 'lpg') total += +b.data.totalCostLpg || 0;
    }
    return total;
  }


  parseAnyDate(dateStr: string): Date | null {
    if (!dateStr) return null;

    if (!isNaN(Date.parse(dateStr))) return new Date(dateStr);

    if (dateStr.includes('/')) {
      const parts = dateStr.split('/');
      if (parts.length === 3) return new Date(+parts[2], +parts[1] - 1, +parts[0]);
    }

    if (dateStr.includes('-')) {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        if (parts[0].length === 2) return new Date(+parts[2], +parts[1] - 1, +parts[0]);
        if (parts[0].length === 4) return new Date(+parts[0], +parts[1] - 1, +parts[2]);
      }
    }

    return null;

  }

  groupBillsByMonth() {
    this.billsByMonth = {};
    this.months.forEach(m => this.billsByMonth[m] = []);

    this.bills.forEach(bill => {
      let dateStr = '';
      if (bill.type === 'electricity') dateStr = bill.data?.fromDate;
      if (bill.type === 'oil') dateStr = bill.data?.deliveryDate;
      if (bill.type === 'lpg') dateStr = bill.data?.fromLpg;

      const date = this.parseAnyDate(dateStr);
      if (!date) return;

      const month = this.months[date.getMonth()];
      this.billsByMonth[month].push(bill);
    });

    this.updateTotal();

  }

  getBillsByYear(year: number): any[] {
    const result: any[] = [];
    for (const month of this.months) {
      const list = this.billsByMonth[month] || [];
      list.forEach(b => {
        const billYear = this.getBillYear(b);
        if (billYear === year) result.push(b);
      });
    }
    return result;
  }

  getBillYear(bill: any): number {
    const dateStr = bill.type === 'electricity' ? bill.data.fromDate :
      bill.type === 'oil' ? bill.data.deliveryDate :
        bill.data.fromLpg;
    const date = this.parseAnyDate(dateStr);
    return date ? date.getFullYear() : 0;
  }

  getBillDate(bill: any): Date {
    const dateStr = bill.type === 'electricity' ? bill.data.fromDate :
      bill.type === 'oil' ? bill.data.deliveryDate :
        bill.data.fromLpg;
    return this.parseAnyDate(dateStr) || new Date();
  }

  updateTotal() {
    let total = 0;
    for (const month of this.months) {
      const bills = this.billsByMonth[month] || [];
      for (const b of bills) {
        if (this.getBillYear(b) === this.selectedYear) {
          if (b.type === 'electricity') total += +b.data.totalCost || 0;
          if (b.type === 'oil') total += +b.data.grossCostOil || 0;
          if (b.type === 'lpg') total += +b.data.totalCostLpg || 0;
        }
      }
    }
    this.totalYearCost = total;
  }

  changeYear(offset: number) {
    this.selectedYear += offset;
    this.updateGridPosition();
  }

  updateGridPosition() {
    if (!this.grid) return;
    const containerWidth = this.grid.nativeElement.offsetWidth;
    this.grid.nativeElement.style.transition = 'transform 0.5s ease-in-out';
    this.grid.nativeElement.style.transform = `translateX(-${containerWidth / 3}px)`;
  }

  openBillDetails(bill: any) { this.selectedBill = bill; }
  closeModal() { this.selectedBill = null; }

  deleteBill(id?: string) {
    if (!id) return;
    this.http.delete(`http://localhost:3000/api/bill/${id}`).subscribe({
      next: () => { this.loadBills(); this.closeModal(); },
      error: (err) => console.error(err)
    });
  }

  viewPdf(filePath: string) {
    if (!filePath) return;
    window.open(`http://localhost:3000/${filePath}`, '_blank');
  }

  goToBillForm() {
    const selectedBuildingId = localStorage.getItem('selectedBuildingId');
    if (!selectedBuildingId) return alert('No building selected!');
    this.router.navigate(['/bill-information', this.type], { queryParams: { buildingId: selectedBuildingId } });
  }
}
