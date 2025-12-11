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
import { environment } from '../../environments/environment';


type BillType = 'electricity' | 'oil' | 'lpg';

@Component({
  selector: 'app-building-info',
  standalone: true,
  imports: [CommonModule, FormsModule, Menu, RouterModule, BackButton],
  templateUrl: './building-info.html',
  styleUrls: ['./building-info.css'],
})
export class BuildingInfo implements OnInit, AfterViewInit {
  @ViewChild('pieChart') pieChartCanvas!: ElementRef<HTMLCanvasElement>;
  private chart?: Chart;

@ViewChild('lineChart') lineChartCanvas!: ElementRef<HTMLCanvasElement>;
private lineChart?: Chart;


  selectedBuilding: Building | null = null;
  isEditing = false;
  isLoading = false;
  errorMessage: string | null = null;
  newImageUrl: string = '';

  // anno selezionato + totali e percentuali
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
    // Il grafico verrà creato dopo il caricamento dei dati
  }

  // --- CREATE PIE CHART ---
  // Creates a new Chart.js pie chart instance
  createPieChart() {
    if (this.chart) {
      this.chart.destroy(); // Distruggi il grafico esistente prima di crearne uno nuovo
    }

    const ctx = this.pieChartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    this.chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Electricity', 'Oil', 'LPG'], // Labels for each sector
        datasets: [{
          data: [
            this.totalsByYear.electricity || 0,
            this.totalsByYear.oil || 0,
            this.totalsByYear.lpg || 0
          ],
          backgroundColor: ['#42A5F5', '#FFCA28', '#66BB6A'] // Customize sector colors
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom' // Position of the legend
          }
        }
      }
    });
  }

// --- CREATE LINE CHART ---
// Crea il grafico lineare curvo
createLineChart(monthlyData: { month: string, electricity: number, oil: number, lpg: number }[]) {
  // filtra solo mesi pari (0 = Gen, 1 = Feb, 2 = Mar, ...)
  const filteredData = monthlyData.filter((_, index) => index % 2 === 1); // mesi pari: Feb, Apr, Giugno, ...

  if (this.lineChart) {
    this.lineChart.destroy(); // distruggi se esiste
  }

  const ctx = this.lineChartCanvas.nativeElement.getContext('2d');
  if (!ctx) return;

  this.lineChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: filteredData.map(d => d.month), // solo mesi pari
      datasets: [
        {
          label: 'Electricity',
          data: filteredData.map(d => d.electricity),
          borderColor: '#42A5F5',
          backgroundColor: '#42A5F5',
          tension: 0.4,
          fill: false
        },
        {
          label: 'Oil',
          data: filteredData.map(d => d.oil),
          borderColor: '#FFCA28',
          backgroundColor: '#FFCA28',
          tension: 0.4,
          fill: false
        },
        {
          label: 'LPG',
          data: filteredData.map(d => d.lpg),
          borderColor: '#66BB6A',
          backgroundColor: '#66BB6A',
          tension: 0.4,
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom'
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}




  // --- UPDATE PIE CHART DATA ---
  // Call this method after calculating totals and percentages
  updatePieChart() {
    if (!this.chart) {
      this.createPieChart();
      return;
    }

    // Aggiorna i dati del grafico esistente
    this.chart.data.datasets[0].data = [
      this.totalsByYear.electricity || 0,
      this.totalsByYear.oil || 0,
      this.totalsByYear.lpg || 0
    ];
    this.chart.update();
  }

  loadBuilding(buildingId: string): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.projectService.getBuildingById(buildingId).subscribe({
      next: async (building: Building) => {
        this.selectedBuilding = building;
        this.isLoading = false;

        //Calcola totali e percentuali appena caricato il building
        await this.updateTotalsPercentages();
        // Crea il grafico a torta con i dati caricati
        this.createPieChart();

          const monthlyData = await this.getMonthlyData(this.selectedYear);
  this.createLineChart(monthlyData);

        
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

  //CALCOLI TOTALE + PERCENTUALI
  async getTotalsAndPercentsByYear(year: number) {
    if (!this.selectedBuilding?._id) return {
      totals: { electricity: 0, oil: 0, lpg: 0, grandTotal: 0 },
      percents: { electricity: 0, oil: 0, lpg: 0 }
    };

    const buildingId = this.selectedBuilding._id;
    const endpoints = [
      `http://${environment.apiUrl}/api/bill/${buildingId}/electricity`,
      `http://${environment.apiUrl}/api/bill/${buildingId}/oil`,
      `http://${environment.apiUrl}/api/bill/${buildingId}/lpg`
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

  // --- CHANGE YEAR ---
  // Updates the selected year and refreshes totals and pie chart
  async changeYear(offset: number) {
    this.selectedYear += offset;

    // Recalculate totals and percentages for the new year
    await this.updateTotalsPercentages();
    // Update the pie chart data
    this.updatePieChart();

      const monthlyData = await this.getMonthlyData(this.selectedYear);
  this.createLineChart(monthlyData);
  }





// Calcolo kWh
async getMonthlyData(year: number) {
  if (!this.selectedBuilding?._id) return [];

  const buildingId = this.selectedBuilding._id;
  const endpoints = [
    `http://${environment.apiUrl}/api/bill/${buildingId}/electricity`,
    `http://${environment.apiUrl}/api/bill/${buildingId}/oil`,
    `http://${environment.apiUrl}/api/bill/${buildingId}/lpg`
  ];

  const results = await Promise.all(
    endpoints.map(url => this.http.get<any[]>(url).toPromise())
  );

  const [electricity, oil, lpg] = results.map(r => r || []);

  // inizializza array 12 mesi
  const months = Array.from({ length: 12 }, (_, i) => ({
    month: new Date(0, i).toLocaleString('default', { month: 'short' }),
    electricity: 0,
    oil: 0,
    lpg: 0
  }));

  const setFinalMonthValue = (list: any[], type: BillType) => {
    list.forEach(b => {
      const to = new Date(b.data?.toDate || b.data?.deliveryDate || b.data?.toLpg);
      if (to.getFullYear() === year) {
        const monthIndex = to.getMonth();
        if (type === 'electricity') {
          months[monthIndex].electricity = (+b.data.kwhDay || 0) + (+b.data.kwhNight || 0);
        }
        if (type === 'oil') {
          months[monthIndex].oil = +b.data.kwhEquivalent || 0;
        }
        if (type === 'lpg') {
          months[monthIndex].lpg = +b.data.cubicMeters || 0;
        }
      }
    });
  }

  setFinalMonthValue(electricity, 'electricity');
  setFinalMonthValue(oil, 'oil');
  setFinalMonthValue(lpg, 'lpg');

  return months;
}

  
}