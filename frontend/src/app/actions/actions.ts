import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../user.service';
import { Menu } from '../menu/menu';
import { BackButton } from '../back-button/back-button';

// Define an interface for individual data items
export interface Item {
  key: string;
  term: string;
  data: string;
}

// Define an interface for Supplier
export interface Supplier {
  id: string;
  name: string;
  items?: Item[];
  showDetails?: boolean; // controls whether details are visible
}

@Component({
  selector: 'app-actions',
  standalone: true,
  imports: [CommonModule, Menu, BackButton],
  templateUrl: './actions.html',
  styleUrls: ['./actions.css']
})
export class Actions implements OnInit {

  term: string = ''; // current term from the route
  suppliers: Supplier[] = []; // list of suppliers

  // Fields always visible in closed card
  private mainFields = ['costWork', 'paybackPeriod', 'warrantyHardware'];

  // Fields to hide in the expanded details view
  // Here we exclude installation info, requirements, and also 'action'
  private hiddenFields = ['installationDate', 'installationTime', 'requirements', 'action'];

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    // Get the term from the URL route
    this.route.paramMap.subscribe(params => {
      const termParam = params.get('term');
      if (termParam) this.term = decodeURIComponent(termParam);
    });

    this.loadSuppliers();
  }

  // Load supplier list from the service
  loadSuppliers(): void {
    this.userService.getSuppliers().subscribe({
      next: users => {
        // Initialize suppliers with showDetails=false
        this.suppliers = users.map(u => ({
          id: u._id.toString(),
          name: u.company_name,
          showDetails: false
        }));

        const supplierIds = this.suppliers.map(s => s.id);
        this.loadUploads(supplierIds);
      },
      error: err => console.error('Error loading suppliers', err)
    });
  }

  // Load uploads for the suppliers and map to items
  loadUploads(supplierIds: string[]): void {
    if (!supplierIds.length) return;

    const selectedAction = localStorage.getItem('selectedAction') || '';
    const selectedTerm = localStorage.getItem('selectedRecommended') || '';

    this.http.get<any[]>(`http://localhost:3000/api/uploads?ids=${supplierIds.join(',')}&action=${encodeURIComponent(selectedAction)}&term=${encodeURIComponent(selectedTerm)}`)
      .subscribe({
        next: uploads => {
          // Map uploads to suppliers
          this.suppliers = this.suppliers.map(supplier => {
            const upload = uploads.find(u => String(u.supplierId) === String(supplier.id));
            if (!upload) return supplier;

            // Convert each field to an Item object
            const items: Item[] = Object.entries(upload)
              // Exclude MongoDB fields only, action will be filtered in getVisibleItems()
              .filter(([key]) => !['_id', 'supplierId', '__v', 'createdAt', 'updatedAt'].includes(key))
              .map(([key, value]) => ({
                key,
                term: this.formatLabel(key),
                data: value != null ? String(value) : ''
              }));

            return { ...supplier, items };
          });
        },
        error: err => console.error('Error loading uploads', err)
      });
  }

  // Toggle card details open/closed
  toggleDetails(supplier: Supplier): void {
    supplier.showDetails = !supplier.showDetails;
  }

  // Format a key to a readable label
  formatLabel(key: string): string {
    return key
      .replace(/([A-Z])/g, ' $1') // split camelCase
      .replace(/_/g, ' ')          // replace underscores
      .replace(/^./, str => str.toUpperCase()); // capitalize first letter
  }

  // Get the first 3 main items for the closed card
  getCardItems(supplier: Supplier): Item[] {
    const seen = new Set<string>();
    return (supplier.items || [])
      .filter(item => this.mainFields.includes(item.key) && !seen.has(item.key) && seen.add(item.key));
  }

  // Get all items for the open card, excluding hidden fields and duplicates
  // COMMENT: We select all items that are not in the hiddenFields array and remove duplicates
  getVisibleItems(supplier: Supplier): Item[] {
    const seen = new Set<string>();
    return (supplier.items || [])
      .filter(item => !this.hiddenFields.includes(item.key) && !seen.has(item.key) && seen.add(item.key));
  }

}
