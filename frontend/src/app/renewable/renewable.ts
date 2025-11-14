import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Menu } from "../menu/menu";
import { BackButton } from "../back-button/back-button";

@Component({
  selector: 'app-renewable',
  standalone: true,
  imports: [CommonModule, Menu, BackButton],
  templateUrl: './renewable.html',
  styleUrls: ['./renewable.css']
})
export class Renewable {

  items = [
    {
      title: 'Renewable energy',
      subtitle1: 'Impact of renewable heat',
      values: [
        { label: 'Cost', value: '€12,345' },
        { label: 'Estimated annual kWh savings', value: '251,560' },
        { label: 'Type of energy saved', value: 'Oil - Fuel Oil' },
        { label: 'Estimated emission saved (tCO2e)', value: '68.83' }
      ],
      expanded: false
    },
    {
      title: 'Solar PV',
      subtitle1: 'Impact of solar PV',
      values: [
        { label: 'Cost', value: '€18,500' },
        { label: 'Estimated annual kWh savings', value: '22,000' },
        { label: 'Estimated emission saved (tCO2e)', value: '7.14' }
      ],
      expanded: false
    }
  ];

  toggle(item: any) {
    item.expanded = !item.expanded;
  }
}
