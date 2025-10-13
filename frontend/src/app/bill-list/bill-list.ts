import { Component } from '@angular/core';
import { Menu } from "../menu/menu";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bill-list',
  imports: [Menu, CommonModule],
  templateUrl: './bill-list.html',
  styleUrl: './bill-list.css'
})
export class BillList {

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