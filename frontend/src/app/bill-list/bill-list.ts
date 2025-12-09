import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Menu } from "../menu/menu";
import { BackButton } from "../back-button/back-button";
import { environment } from '../../environments/environment';

type BillType = 'electricity' | 'oil' | 'lpg';

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
  selectedBuildingName = localStorage.getItem('selectedBuildingName') || '';
  type: BillType = 'electricity';
  bills: any[] = [];
  billsByMonth: Record<string, any[]> = {};
  months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  selectedYear = new Date().getFullYear();
  selectedBill: any = null;
  totalYearCost = 0;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      const typeParam = params.get('type') as BillType;
      if (!id || !typeParam) return;

      this.buildingId = id;
      this.type = typeParam;
      this.loadBills();
    });
  }

  ngAfterViewInit(): void {
    this.updateGridPosition();
  }

  // --- LOAD BILLS ---
  loadBills(): void {
    this.http.get(`${environment.apiUrl}/api/bill/${this.buildingId}/${this.type}`)
      .subscribe({
        next: (data: any) => {
          this.bills = data || [];
          this.groupBillsByMonth();
          this.updateGridPosition();
        },
        error: (err) => console.error('Error loading bills:', err)
      });
  }

  // --- PARSING DATE FLESSIBILE ---
  parseAnyDate(dateStr: string): Date | null {
    if (!dateStr) return null;
    if (!isNaN(Date.parse(dateStr))) return new Date(dateStr);
    if (dateStr.includes('/')) {
      const [day, month, year] = dateStr.split('/').map(Number);
      if (day && month && year) return new Date(year, month - 1, day);
    }
    if (dateStr.includes('-')) {
      const parts = dateStr.split('-').map(Number);
      if (parts.length === 3) {
        return parts[0] > 31
          ? new Date(parts[0], parts[1] - 1, parts[2]) // yyyy-MM-dd
          : new Date(parts[2], parts[1] - 1, parts[0]); // dd-MM-yyyy
      }
    }
    return null;
  }

  // --- GROUP BY MONTH ---
  groupBillsByMonth(): void {
    this.billsByMonth = {};
    this.months.forEach(m => this.billsByMonth[m] = []);

    this.bills.forEach(bill => {
      const dateStr = this.getBillDateString(bill);
      const date = this.parseAnyDate(dateStr);
      if (!date) return;

      const month = this.months[date.getMonth()];
      this.billsByMonth[month].push(bill);
    });

    this.updateTotal();
  }

  getBillDateString(bill: any): string {
    if (bill.type === 'electricity') return bill.data?.fromDate;
    if (bill.type === 'oil') return bill.data?.deliveryDate;
    return bill.data?.fromDate || bill.data?.fromLpg;
  }

  getBillYear(bill: any): number {
    const date = this.parseAnyDate(this.getBillDateString(bill));
    return date ? date.getFullYear() : 0;
  }

  getBillDate(bill: any): Date {
    return this.parseAnyDate(this.getBillDateString(bill)) || new Date();
  }

  // --- CALCOLO TOTALE ---
  updateTotal(): void {
    this.totalYearCost = this.getTotalByYear(this.selectedYear);
  }

  getTotalByYear(year: number): number {
    return this.getBillsByYear(year)
      .reduce((sum, b) => {
        if (b.type === 'electricity') return sum + (+b.data.totalCost || 0);
        if (b.type === 'oil') return sum + (+b.data.grossCostOil || 0);
        return sum + (+b.data.totalCostLpg || 0);
      }, 0);
  }

  getBillsByYear(year: number): any[] {
    return this.months.flatMap(month => {
      const list = this.billsByMonth[month] || [];
      return list.filter(b => this.getBillYear(b) === year);
    });
  }

  // --- SCROLL GRID ---
  scrollYears(direction: 'left' | 'right'): void {
    const container = document.querySelector('.three-year-grid-wrapper') as HTMLElement;
    if (!container) return;
    const scrollAmount = 320;
    container.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
  }

  updateGridPosition(): void {
    if (!this.grid) return;
    const width = this.grid.nativeElement.offsetWidth;
    this.grid.nativeElement.style.transition = 'transform 0.5s ease-in-out';
    this.grid.nativeElement.style.transform = `translateX(-${width / 3}px)`;
  }

  changeYear(offset: number): void {
    this.selectedYear += offset;
    this.updateGridPosition();
    this.updateTotal();
  }

  // --- MODAL ---
  openBillDetails(bill: any): void { this.selectedBill = bill; }
  closeModal(): void { this.selectedBill = null; }

  // --- DELETE ---
  deleteBill(id?: string): void {
    if (!id) return;
    this.http.delete(`${environment.apiUrl}/api/bill/${id}`).subscribe({
      next: () => { this.loadBills(); this.closeModal(); },
      error: (err) => console.error(err)
    });
  }

  // --- VIEW PDF ---
  viewPdf(filePath: string): void {
    if (!filePath) return;
    window.open(`${environment.apiUrl}/${filePath}`, '_blank');
  }

  // --- NAVIGATE TO FORM ---
  goToBillForm(): void {
    const selectedBuildingId = localStorage.getItem('selectedBuildingId');
    if (!selectedBuildingId) return alert('No building selected!');
    this.router.navigate(['/bill-information', this.type], { queryParams: { buildingId: selectedBuildingId } });
  }

  // --- EDIT BILL ---
  editBill(billId: string): void {
    if (!billId) return;
    // Passiamo il billId come query param al form
    this.router.navigate(['/bill-information', this.type], { 
      queryParams: { buildingId: this.buildingId, billId } 
    });
  }
}
