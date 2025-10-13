
  import { Component } from '@angular/core';
import { MenuComponent } from "../menu/menu";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-upload-bill',
  imports: [MenuComponent, CommonModule],
  templateUrl: './upload-bill.html',
  styleUrl: './upload-bill.css'
})
export class UploadBill {

  bill = [
    { term: 'Electricity'},
    { term: 'Gas'},
    { term: 'Water'},
    { term: 'Other'}
  ];
  month = [
    { term: 'January'},
    { term: 'February'},
    { term: 'March'},
    { term: 'April'}, 
    { term: 'May'},
    { term: 'June'},
    { term: 'July'},
    { term: 'August'},
    { term: 'September'},
    { term: 'October'},
    { term: 'November'},
    { term: 'December'}
  ];

  toggleDefinition(item: any) {
    item.expanded = !item.expanded;
  }
}