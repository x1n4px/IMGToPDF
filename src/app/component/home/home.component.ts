import { Component } from '@angular/core';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  selectedFile: File | null = null;
  pdfDownloadLink: string | null = null;
  onFileSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files) {
      this.selectedFile = inputElement.files[0];
    }
  }

  convertToPdf() {
    if (!this.selectedFile) {
      console.error('No se ha seleccionado una imagen.');
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const imageDataUrl = reader.result as string;

      const doc = new jsPDF();
      const img = new Image();
      img.src = imageDataUrl;

      img.onload = () => {
        const { width, height } = img;
        const pdfWidth = doc.internal.pageSize.getWidth();
        const pdfHeight = doc.internal.pageSize.getHeight();

        // Calculamos el factor de escala para ajustar la imagen al tamaño del PDF.
        const scale = Math.min(pdfWidth / width, pdfHeight / height);

        const scaledWidth = width * scale;
        const scaledHeight = height * scale;

        // Centramos la imagen vertical y horizontalmente en el PDF.
        const x = (pdfWidth - scaledWidth) / 2;
        const y = (pdfHeight - scaledHeight) / 2;

        doc.addImage(imageDataUrl, 'JPEG', x, y, scaledWidth, scaledHeight);
        const pdfBlob = doc.output('blob');
        this.pdfDownloadLink = URL.createObjectURL(pdfBlob);
      };
    };

    reader.readAsDataURL(this.selectedFile);
  }


  limpiarImagen() {
    this.selectedFile = null;
    this.pdfDownloadLink = null;
  }
}
