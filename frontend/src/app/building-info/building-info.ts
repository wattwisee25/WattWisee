import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectService, Building } from '../project.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Menu } from '../menu/menu';
import { RouterModule } from '@angular/router';
import { BackButton } from "../back-button/back-button";
import { HttpClient } from '@angular/common/http';
import { environment } from '../../enviroments/enviroments';

import Chart from 'chart.js/auto';   // Chart.js auto-registers all components

type BillType = 'electricity' | 'oil' | 'lpg';

@Component({
  selector: 'app-building-info',
  standalone: true,
  imports: [CommonModule, FormsModule, Menu, RouterModule, BackButton],
  templateUrl: './building-info.html',
  styleUrls: ['./building-info.css']
})
export class BuildingInfo implements OnInit, OnDestroy {

  selectedBuilding: Building | null = null;
  isEditing = false;
  isLoading = false;
  errorMessage: string | null = null;
  newImageUrl: string = '';

  // Selected year used for totals and percentages
  selectedYear = new Date().getFullYear();

  // Stores the total cost for each energy type
  totalsByYear = {
    electricity: 0,
    oil: 0,
    lpg: 0,
    grandTotal: 0
  };

  // Stores the percentage distribution for each energy type
  percentsByYear = {
    electricity: 0,
    oil: 0,
    lpg: 0
  };

  // Chart instance (used to destroy and recreate the pie chart)
  private pieChart: Chart | null = null;

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    // Retrieve building ID from route and load data
    this.route.paramMap.subscribe(params => {
      const buildingId = params.get('id');
      if (buildingId) {
        this.loadBuilding(buildingId);
      } else {
        this.errorMessage = 'No building ID provided in the URL';
      }
    });
  }

  ngOnDestroy() {
    // Prevent Chart.js memory leaks
    if (this.pieChart) {
      this.pieChart.destroy();
    }
  }

  loadBuilding(buildingId: string): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.projectService.getBuildingById(buildingId).subscribe({
      next: async (building: Building) => {
        this.selectedBuilding = building;
        this.isLoading = false;

        // After loading the building, compute totals and draw chart
        await this.updateTotalsPercentages();
      },
      error: err => {
        console.error('Error while loading building', err);
        this.errorMessage = err.error?.message || 'Error while loading building';
        this.isLoading = false;
      }
    });
  }

  toggleEdit() {
    // Switch between read-only and edit mode
    this.isEditing = !this.isEditing;
  }

  save() {
    // Prevent saving if building ID is missing
    if (!this.selectedBuilding?._id) return;

    // Send update request to backend
    this.projectService.updateBuilding(this.selectedBuilding._id, this.selectedBuilding)
      .subscribe({
        next: (response) => {
          this.selectedBuilding = response;
          this.isEditing = false; // Return to read-only mode
        },
        error: err => {
          console.error('Error updating building', err);
          this.errorMessage = 'Error while saving';
        }
      });
  }

  // =========================
  // Calculate yearly totals and percentages
  // =========================
  async getTotalsAndPercentsByYear(year: number) {

    // Safe fallback when no building is loaded
    if (!this.selectedBuilding?._id) return {
      totals: { electricity: 0, oil: 0, lpg: 0, grandTotal: 0 },
      percents: { electricity: 0, oil: 0, lpg: 0 }
    };

    const buildingId = this.selectedBuilding._id;

    // API endpoints for the three bill types
    const endpoints = [
      `${environment.apiUrl}/api/bill/${buildingId}/electricity`,
      `${environment.apiUrl}/api/bill/${buildingId}/oil`,
      `${environment.apiUrl}/api/bill/${buildingId}/lpg`
    ];

    // Fetch all bill types in parallel
    const results = await Promise.all(
      endpoints.map(url => this.http.get<any[]>(url).toPromise())
    );

    const [electricity, oil, lpg] = results.map(r => r || []);

    // Helper function: sums costs of invoices for the selected year
    const sumType = (list: any[], type: BillType) =>
      list
        .filter(b => {
          const date = new Date(b.data?.fromDate || b.data?.deliveryDate);
          return date.getFullYear() === year;
        })
        .reduce((tot, b) => {
          if (type === 'electricity') return tot + (+b.data.totalCost || 0);
          if (type === 'oil') return tot + (+b.data.grossCostOil || 0);
          return tot + (+b.data.totalCostLpg || 0);
        }, 0);

    // Compute totals per type
    const totalElectricity = sumType(electricity, "electricity");
    const totalOil = sumType(oil, "oil");
    const totalLpg = sumType(lpg, "lpg");

    const grandTotal = totalElectricity + totalOil + totalLpg;

    // Helper to compute percentage safely
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

  // Refresh computed values and update chart
  async updateTotalsPercentages() {
    const result = await this.getTotalsAndPercentsByYear(this.selectedYear);
    this.totalsByYear = result.totals;
    this.percentsByYear = result.percents;

    this.updatePieChart(); // Redraw chart with updated data
  }

  // Change displayed year (+1 or -1)
  async changeYear(offset: number) {
    this.selectedYear += offset;
    await this.updateTotalsPercentages();
  }

  // =========================
  // Pie Chart rendering
  // =========================
  updatePieChart() {
    const canvas = document.getElementById('yearPieChart') as HTMLCanvasElement;
    if (!canvas) return;

    // Destroy previous chart instance to avoid duplicates
    if (this.pieChart) {
      this.pieChart.destroy();
    }

    // Arrays stored for tooltip callback usage
    const percentsArray = [
      this.percentsByYear.electricity,
      this.percentsByYear.oil,
      this.percentsByYear.lpg
    ];

    const valuesArray = [
      this.totalsByYear.electricity,
      this.totalsByYear.oil,
      this.totalsByYear.lpg
    ];

    // Create the Pie Chart
    this.pieChart = new Chart(canvas, {
      type: 'pie',
      data: {
        labels: ['Electricity', 'Oil', 'LPG'],
        datasets: [{
          data: valuesArray,
          backgroundColor: ['#4e79a7', '#f28e2b', '#e15759'], // Friendly color palette
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' },

          // Custom tooltip showing both value and percentage
          tooltip: {
            callbacks: {
              label: (context: any) => {
                const index = context.dataIndex;
                const value = valuesArray[index];
                const percent = percentsArray[index];

                return `${context.label}: €${value.toFixed(2)} (${percent.toFixed(1)}%)`;
              }
            }
          }
        }
      }
    });
  }
}
