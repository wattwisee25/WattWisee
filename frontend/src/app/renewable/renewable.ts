import { AfterViewInit, Component } from '@angular/core';
import { Menu } from "../menu/menu";
import { BackButton } from "../back-button/back-button";
import { ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

interface AssessmentItem {
  title: string;
  subtitle1: string;
  values: { label: string; value: string }[];
  subtitle2: string;
}

@Component({
  selector: 'app-renewable',
  imports: [Menu, BackButton, CommonModule],
  templateUrl: './renewable.html',
  styleUrl: './renewable.css'
})
export class Renewable implements AfterViewInit {
  @ViewChild('scrollContainer', { static: true }) scrollContainer!: ElementRef<HTMLDivElement>;

  items: AssessmentItem[] = [
    {
      title: 'Renewable energy',
      subtitle1: 'Impact of renewable heat',
      values: [
        { label: 'Estimated annual kWh savings', value: '251,560' },
        { label: 'Type of energy saved', value: 'Oil - Fuel Oil' },
        { label: 'Estimated emission saved (tCO2e)', value: '68.83' },
      ],
      subtitle2: 'Renewable heat assessment'
    },
    {
      title: 'Current PV ',
      subtitle1: 'Impact of solar PV',
      values: [
        { label: 'Estimated annual kWh savings', value: '22,000' },
        { label: 'Estimated emission saved (tCO2e)', value: '7.14' }
      ],
      subtitle2: 'Solar photovoltaic assessment'
    }
  ];

  activeIndex = 0;

  ngAfterViewInit() {
    this.updateActiveIndex();
  }

  scrollLeft() {
    const width = this.scrollContainer.nativeElement.clientWidth;
    this.scrollContainer.nativeElement.scrollBy({ left: -width, behavior: 'smooth' });
    setTimeout(() => this.updateActiveIndex(), 300);
  }

  scrollRight() {
    const width = this.scrollContainer.nativeElement.clientWidth;
    this.scrollContainer.nativeElement.scrollBy({ left: width, behavior: 'smooth' });
    setTimeout(() => this.updateActiveIndex(), 300);
  }

  updateActiveIndex() {
    const scrollLeft = this.scrollContainer.nativeElement.scrollLeft;
    const containerWidth = this.scrollContainer.nativeElement.clientWidth;
    this.activeIndex = Math.round(scrollLeft / containerWidth);
  }
}
