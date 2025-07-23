import { Component } from '@angular/core';
import { MenuComponent } from "../menu/menu";

@Component({
  selector: 'app-supervision-checklist',
  templateUrl: './checklist.html',
  imports: [MenuComponent],
  styleUrls: ['./checklist.css']
})
export class ChecklistComponent {
  // Per ora nessuna logica specifica, solo visualizzazione statica
}
