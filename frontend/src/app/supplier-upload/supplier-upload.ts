import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SupplierMenuComponent } from '../supplier-menu/supplier-menu';

@Component({
  selector: 'app-supplier-upload',
  standalone: true, 
  imports: [SupplierMenuComponent, CommonModule],
  templateUrl: './supplier-upload.html',
  styleUrl: './supplier-upload.css'
})
export class SupplierUploadComponent implements OnInit {
  
    term: string = '';
  
    constructor(private route: ActivatedRoute, private sanitizer: DomSanitizer, private router: Router) {

}
  ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
      const termParam = params.get('term');
      if (termParam) {
        this.term = decodeURIComponent(termParam);
      }
    });

  }
}

