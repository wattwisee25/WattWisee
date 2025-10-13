import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Menu } from "../menu/menu";
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-action-plan',
  imports: [Menu, CommonModule],
  templateUrl: './action-plan.html',
  styleUrl: './action-plan.css'
})
export class ActionPlan {

  items: { icon: SafeHtml, term: string }[] = [];

  constructor(private sanitizer: DomSanitizer) {
    this.items = [
      {
        icon: this.sanitizer.bypassSecurityTrustHtml(`
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" 
            stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
            class="icon icon-tabler icon-tabler-building-cog">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M3 21h9" />
            <path d="M9 8h1" />
            <path d="M9 12h1" />
            <path d="M9 16h1" />
            <path d="M14 8h1" />
            <path d="M14 12h1" />
            <path d="M5 21v-16c0-.53.211-1.039.586-1.414.375-.375.884-.586 1.414-.586h10c.53 0 
              1.039.211 1.414.586.375.375.586.884.586 1.414v7" />
          </svg>`),
        term: 'Building Envelope'
      },
      {
        icon: this.sanitizer.bypassSecurityTrustHtml(`
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round"
            class="icon icon-tabler icon-tabler-flame">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M12 10.941c2.333 -3.308 .167 -7.823 -1 -8.941
              0 3.395 -2.235 5.299 -3.667 6.706
              -1.43 1.408 -2.333 3.621 -2.333 5.588
              0 3.704 3.134 6.706 7 6.706s7-3.002 7-6.706
              c0-1.712 -1.232 -4.403 -2.333-5.588
              -2.084 3.353 -3.257 3.353 -4.667 2.235" />
          </svg>`),
        term: 'Heating'
      },
    {
      icon:  this.sanitizer.bypassSecurityTrustHtml(`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round"
        class="icon icon-tabler icon-tabler-sun">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
        <path d="M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7" />
      </svg>`),
      term: 'Lighting'
    },
    {
      icon:  this.sanitizer.bypassSecurityTrustHtml(`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round"
        class="icon icon-tabler icon-tabler-sun-electricity">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M8 12a4 4 0 0 0 4 4m0 -8a4 4 0 0 0 -4 4" />
        <path d="M3 12h1" /><path d="M12 3v1" /><path d="M12 20v1" />
        <path d="M5.6 5.6l.7 .7" /><path d="M6.3 17.7l-.7 .7" />
        <path d="M20 7l-3 5h4l-3 5" />
      </svg>`),
      term: 'Renewables'
    },
    {
      icon:  this.sanitizer.bypassSecurityTrustHtml(`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round"
        class="icon icon-tabler icon-tabler-droplets">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M4.072 20.3a2.999 2.999 0 0 0 3.856 0a3.002 3.002 0 0 0 .67 -3.798
        l-2.095 -3.227a.6 .6 0 0 0 -1.005 0l-2.098 3.227a3.003 3.003 0 0 0 .671 3.798z" />
        <path d="M16.072 20.3a2.999 2.999 0 0 0 3.856 0a3.002 3.002 0 0 0 .67 -3.798
        l-2.095 -3.227a.6 .6 0 0 0 -1.005 0l-2.098 3.227a3.003 3.003 0 0 0 .671 3.798z" />
        <path d="M10.072 10.3a2.999 2.999 0 0 0 3.856 0a3.002 3.002 0 0 0 .67 -3.798
        l-2.095 -3.227a.6 .6 0 0 0 -1.005 0l-2.098 3.227a3.003 3.003 0 0 0 .671 3.798z" />
      </svg>`),
      term: 'Domestic hot water'
    },
    {
      icon:  this.sanitizer.bypassSecurityTrustHtml(`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round"
        class="icon icon-tabler icon-tabler-engine">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M3 10v6" /><path d="M12 5v3" /><path d="M10 5h4" /><path d="M5 13h-2" />
        <path d="M6 10h2l2 -2h3.382a1 1 0 0 1 .894 .553l1.448 2.894a1 1 0 0 0 
        .894 .553h1.382v-2h2a1 1 0 0 1 1 1v6a1 1 0 0 1 -1 1h-2v-2h-3v2a1 1 0 
        0 1 -1 1h-3.465a1 1 0 0 1 -.832 -.445l-1.703 -2.555h-2v-6z" />
      </svg>`),
      term: 'Motors & Compressed Air'
    },
    {
      icon:  this.sanitizer.bypassSecurityTrustHtml(`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round"
        class="icon icon-tabler icon-tabler-settings-spark">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M11.992 21c-.728 -.003 -1.455 -.442 -1.667 -1.317a1.724 1.724 0 0 0 
        -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 
        -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 
        1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 
        -1.065c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 
        1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 
        2.572c.882 .214 1.32 .95 1.317 1.684" />
        <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
        <path d="M19 22.5a4.75 4.75 0 0 1 3.5 -3.5a4.75 4.75 0 0 1 -3.5 -3.5a4.75 
        4.75 0 0 1 -3.5 3.5a4.75 4.75 0 0 1 3.5 3.5" />
      </svg>`),
      term: 'Building automation & Controls'
    },
    {
      icon:  this.sanitizer.bypassSecurityTrustHtml(`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round"
        class="icon icon-tabler icon-tabler-truck">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
        <path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
        <path d="M5 17h-2v-11a1 1 0 0 1 1 -1h9v12m-4 0h6m4 0h2v-6h-8m0 -5h5l3 5" />
      </svg>`),
      term: 'Transport'
    },
    {
      icon:  this.sanitizer.bypassSecurityTrustHtml(`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round"
        class="icon icon-tabler icon-tabler-dots">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M5 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
        <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
        <path d="M19 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
      </svg>`),
      term: 'Others'
    }
    ];
  }
}
