import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectService, Building } from '../project.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Menu } from '../menu/menu';
import { RouterModule } from '@angular/router';
import { BackButton } from "../back-button/back-button";
import { HttpClient } from '@angular/common/http';
import { Chart, ChartConfiguration } from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { environment } from '../../environments/environment';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
// import { faCoffee, faHeart, faBolt } from '@fortawesome/free-solid-svg-icons';

type BillType = 'electricity' | 'oil' | 'lpg';
type LineChartMode = 'kwh' | 'cost';

@Component({
  selector: 'app-building-info',
  standalone: true,
  imports: [CommonModule, FormsModule, Menu, RouterModule, BackButton, FontAwesomeModule],
  templateUrl: './building-info.html',
  styleUrls: ['./building-info.css']
})
export class BuildingInfo implements OnInit, AfterViewInit {
  @ViewChild('pieChart') pieChartCanvas!: ElementRef<HTMLCanvasElement>;
  private chart?: Chart;

  @ViewChild('lineChart') lineChartCanvas!: ElementRef<HTMLCanvasElement>;
  private lineChart?: Chart;

  selectedBuilding: Building | null = null;
  isPieExpanded = false;
  isLineExpanded = false;
  isEditing = false;
  isLoading = false;
  showKwh = true;
  lineChartMode: LineChartMode = 'kwh';
  errorMessage: string | null = null;
  newImageUrl: string = '';

  selectedYear = new Date().getFullYear();

  totalsByYear = {
    electricity: 0,
    oil: 0,
    lpg: 0,
    grandTotal: 0
  };

  percentsByYear = {
    electricity: 0,
    oil: 0,
    lpg: 0
  };

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private http: HttpClient
  ) { }

  toggleChart() {
    this.lineChartMode = this.lineChartMode === 'kwh' ? 'cost' : 'kwh';
    this.refreshLineChart();
  }

  togglePieExpand() {
    this.isPieExpanded = !this.isPieExpanded;

    //forza il resize del chart quando cambia dimensione
    setTimeout(() => {
      this.chart?.resize();
    }, 0);
  }

  toggleLineExpand() {
    this.isLineExpanded = !this.isLineExpanded;

    //forza il resize del chart quando cambia dimensione
    setTimeout(() => {
      this.lineChart?.resize();
    }, 0);
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const buildingId = params.get('id');
      if (buildingId) {
        this.loadBuilding(buildingId);
      } else {
        this.errorMessage = 'No building ID provided in the URL';
      }
    });
  }

  ngAfterViewInit(): void {
    // il grafico verrà creato dopo il caricamento dei dati
  }

  private isAllZero(): boolean {
    return (this.totalsByYear?.grandTotal ?? 0) === 0;
  }

  createPieChart() {
    if (this.chart) this.chart.destroy();

    const ctx = this.pieChartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const allZero = this.isAllZero();

    const labels = allZero ? ['No data'] : ['Electricity', 'Oil', 'LPG'];
    const data = allZero
      ? [1]
      : [
        this.totalsByYear.electricity || 0,
        this.totalsByYear.oil || 0,
        this.totalsByYear.lpg || 0
      ];
    const backgroundColor = allZero
      ? ['#e0e0e0']
      : ['#c1dbe3', '#292929ff', '#f6ffa2'];

    const config: ChartConfiguration<'doughnut'> = {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{ data, backgroundColor }]
      },
      options: {
        responsive: true,
        cutout: '55%',
        layout: { padding: { top: 20 } },
        plugins: {
          legend: { position: 'bottom', labels: { padding: 30 } },
          datalabels: {
            color: '#333',
            font: { weight: 'bold' },
            align: 'end',
            anchor: 'end',
            offset: 0.5,
            clamp: true,
            formatter: (value, context) => {
              if (this.isAllZero()) return '';
              let percent: number;
              switch (context.dataIndex) {
                case 0: percent = this.percentsByYear.electricity; break;
                case 1: percent = this.percentsByYear.oil; break;
                case 2: percent = this.percentsByYear.lpg; break;
                default: percent = 0;
              }
              return percent > 0.1 ? `${percent.toFixed(1)}%` : '';
            }
          }
        },
        maintainAspectRatio: false
      },
      plugins: [ChartDataLabels]
    };

    this.chart = new Chart(ctx, config);
  }

  updatePieChart() {
    if (!this.chart) {
      this.createPieChart();
      return;
    }

    const allZero = this.isAllZero();

    if (allZero) {
      this.chart.data.labels = ['No data'];
      if (!this.chart.data.datasets || this.chart.data.datasets.length === 0) {
        this.chart.data.datasets = [{ data: [1], backgroundColor: ['#e0e0e0'] } as any];
      } else {
        this.chart.data.datasets[0].data = [1];
        (this.chart.data.datasets[0] as any).backgroundColor = ['#e0e0e0'];
      }
    } else {
      this.chart.data.labels = ['Electricity', 'Oil', 'LPG'];
      this.chart.data.datasets[0].data = [
        this.totalsByYear.electricity || 0,
        this.totalsByYear.oil || 0,
        this.totalsByYear.lpg || 0
      ];
      (this.chart.data.datasets[0] as any).backgroundColor = ['#c1dbe3', '#292929ff', '#f6ffa2'];
    }

    this.chart.update();
  }

  async refreshLineChart() {
    const data =
      this.lineChartMode === 'kwh'
        ? await this.getMonthlyKwhData(this.selectedYear)
        : await this.getMonthlyCostData(this.selectedYear);

    this.createLineChart(data, this.lineChartMode);
  }

  createLineChart(
    monthlyData: { month: string, electricity: number, oil: number, lpg: number }[],
    mode: LineChartMode
  ) {
    if (this.lineChart) this.lineChart.destroy();  // destroy if already exists

    const ctx = this.lineChartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const unit = mode === 'kwh' ? 'kWh' : '€';

    this.lineChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: monthlyData.map(d => d.month),
        datasets: [
          {
            label: `Electricity (${unit})`,
            data: monthlyData.map(d => d.electricity),
            borderColor: '#c1dbe3',
            backgroundColor: '#c1dbe3',
            tension: 0.4,
            fill: false
          },
          {
            label: `Oil (${unit})`,
            data: monthlyData.map(d => d.oil),
            borderColor: '#292929ff',
            backgroundColor: '#292929ff',
            tension: 0.4,
            fill: false
          },
          {
            label: `LPG (${unit})`,
            data: monthlyData.map(d => d.lpg),
            borderColor: '#f6ffa2',
            backgroundColor: '#f6ffa2',
            tension: 0.4,
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' }
        },
        scales: { y: { beginAtZero: true } }
      }
    });
  }


  loadBuilding(buildingId: string): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.projectService.getBuildingById(buildingId).subscribe({
      next: async (building: Building) => {
        this.selectedBuilding = building;
        this.isLoading = false;

        await this.updateTotalsPercentages();
        this.createPieChart();

        await this.refreshLineChart();
      },
      error: err => {
        console.error('Error while loading building', err);
        this.errorMessage = err.error?.message || 'Error while loading building';
        this.isLoading = false;
      }
    });
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  save() {
    if (!this.selectedBuilding?._id) return;

    this.projectService.updateBuilding(this.selectedBuilding._id, this.selectedBuilding)
      .subscribe({
        next: (response) => {
          this.selectedBuilding = response;
          this.isEditing = false;
        },
        error: err => {
          console.error('Error updating building', err);
          this.errorMessage = 'Error while saving';
        }
      });
  }

  async getTotalsAndPercentsByYear(year: number) {
    if (!this.selectedBuilding?._id) return {
      totals: { electricity: 0, oil: 0, lpg: 0, grandTotal: 0 },
      percents: { electricity: 0, oil: 0, lpg: 0 }
    };

    const buildingId = this.selectedBuilding._id;
    const endpoints = [
      `${environment.apiUrl}/api/bill/${buildingId}/electricity`,
      `${environment.apiUrl}/api/bill/${buildingId}/oil`,
      `${environment.apiUrl}/api/bill/${buildingId}/lpg`
    ];

    const results = await Promise.all(
      endpoints.map(url => this.http.get<any[]>(url).toPromise())
    );

    const [electricity, oil, lpg] = results.map(r => r || []);

    const sumType = (list: any[], type: BillType) =>
      list
        .filter(b => {
          const date = new Date(b.data?.fromDate || b.data?.deliveryDate || b.data?.fromLpg);
          return date.getFullYear() === year;
        })
        .reduce((tot, b) => {
          if (type === 'electricity') return tot + (+b.data.totalCost || 0);
          if (type === 'oil') return tot + (+b.data.grossCostOil || 0);
          return tot + (+b.data.totalCostLpg || 0);
        }, 0);

    const totalElectricity = sumType(electricity, "electricity");
    const totalOil = sumType(oil, "oil");
    const totalLpg = sumType(lpg, "lpg");

    const grandTotal = totalElectricity + totalOil + totalLpg;

    const percent = (value: number) => grandTotal > 0 ? (value / grandTotal) * 100 : 0;

    return {
      totals: {
        electricity: totalElectricity,
        oil: totalOil,
        lpg: totalLpg,
        grandTotal
      },
      percents: {
        electricity: percent(totalElectricity),
        oil: percent(totalOil),
        lpg: percent(totalLpg)
      }
    };
  }

  async updateTotalsPercentages() {
    const result = await this.getTotalsAndPercentsByYear(this.selectedYear);
    this.totalsByYear = result.totals;
    this.percentsByYear = result.percents;
  }

  async changeYear(offset: number) {
    this.selectedYear += offset;
    await this.updateTotalsPercentages();
    this.updatePieChart();
    await this.refreshLineChart();
  }

  async getMonthlyKwhData(year: number) {
    if (!this.selectedBuilding?._id) return [];

    const buildingId = this.selectedBuilding._id;
    const endpoints = [
      `${environment.apiUrl}/api/bill/${buildingId}/electricity`,
      `${environment.apiUrl}/api/bill/${buildingId}/oil`,
      `${environment.apiUrl}/api/bill/${buildingId}/lpg`
    ];

    const results = await Promise.all(endpoints.map(url => this.http.get<any[]>(url).toPromise()));
    const [electricity, oil, lpg] = results.map(r => r || []);

    const months = Array.from({ length: 12 }, (_, i) => ({
      month: new Date(0, i).toLocaleString('default', { month: 'short' }),
      electricity: 0,
      oil: 0,
      lpg: 0
    }));

    const setKwh = (list: any[], type: BillType) => {
      list.forEach(b => {
        const to = new Date(b.data?.toDate || b.data?.deliveryDate || b.data?.toLpg);
        if (to.getFullYear() === year) {
          const monthIndex = to.getMonth();
          if (type === 'electricity') months[monthIndex].electricity += (+b.data.kwhDay || 0) + (+b.data.kwhNight || 0);
          if (type === 'oil') months[monthIndex].oil += (+b.data.kwhEquivalent || 0);
          if (type === 'lpg') months[monthIndex].lpg += (+b.data.cubicMeters || 0);
        }
      });
    };

    setKwh(electricity, 'electricity');
    setKwh(oil, 'oil');
    setKwh(lpg, 'lpg');

    return months;
  }

  async getMonthlyCostData(year: number) {
    if (!this.selectedBuilding?._id) return [];

    const buildingId = this.selectedBuilding._id;
    const endpoints = [
      `${environment.apiUrl}/api/bill/${buildingId}/electricity`,
      `${environment.apiUrl}/api/bill/${buildingId}/oil`,
      `${environment.apiUrl}/api/bill/${buildingId}/lpg`
    ];

    const results = await Promise.all(endpoints.map(url => this.http.get<any[]>(url).toPromise()));
    const [electricity, oil, lpg] = results.map(r => r || []);

    const months = Array.from({ length: 12 }, (_, i) => ({
      month: new Date(0, i).toLocaleString('default', { month: 'short' }),
      electricity: 0,
      oil: 0,
      lpg: 0
    }));

    const addCost = (list: any[], type: BillType) => {
      list.forEach(b => {
        const date = new Date(b.data?.fromDate || b.data?.deliveryDate || b.data?.fromLpg);
        if (date.getFullYear() === year) {
          const m = date.getMonth();
          if (type === 'electricity') months[m].electricity += (+b.data.totalCost || 0);
          if (type === 'oil') months[m].oil += (+b.data.grossCostOil || 0);
          if (type === 'lpg') months[m].lpg += (+b.data.totalCostLpg || 0);
        }
      });
    };

    addCost(electricity, 'electricity');
    addCost(oil, 'oil');
    addCost(lpg, 'lpg');

    return months;
  }

}
