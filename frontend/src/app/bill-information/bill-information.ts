import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bill-form',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bill-information.html',
  styleUrls: ['./bill-information.css']
})
export class BillInformationComponent implements OnInit {
  billType: string = '';

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.billType = this.route.snapshot.paramMap.get('type') || '';
  }

  onNext(): void {
    // logica se devi salvare i dati
    this.router.navigate(['/upload-bills']);
  }
}
