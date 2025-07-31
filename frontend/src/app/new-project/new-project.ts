import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-access',
  imports: [FormsModule],
  templateUrl: './new-project.html',
  styleUrl: './new-project.css'
})
export class NewProjectComponent {
projectName: string = '';
  buildingName: string = '';
  selectedFile: File | null = null;

  buildings: { name: string, image: string }[] = [];

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  addBuilding(): void {
    if (!this.buildingName || !this.selectedFile) {
      alert('Please enter building name and select a photo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const imageUrl = reader.result as string;
      this.buildings.push({ name: this.buildingName, image: imageUrl });
      this.buildingName = '';
      this.selectedFile = null;
    };
    reader.readAsDataURL(this.selectedFile);
  }
}
