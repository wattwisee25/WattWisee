import { Component } from '@angular/core';
import { Menu } from "../menu/menu";
import { BackButton } from "../back-button/back-button";

@Component({
  selector: 'app-audit-report',
  imports: [Menu, BackButton],
  templateUrl: './audit-report.html',
  styleUrl: './audit-report.css'
})
export class AuditReport {

}
