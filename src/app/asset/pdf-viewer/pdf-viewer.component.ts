// pdf-viewer.component.ts
import { Component, AfterViewInit, Input } from '@angular/core';
import { environment } from 'src/environments/environment';
import { NgxExtendedPdfViewerModule } from "ngx-extended-pdf-viewer";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.css'],
  imports: [NgxExtendedPdfViewerModule,CommonModule]
})
export class PdfViewerComponent implements AfterViewInit {
  @Input() url = '';              // the ID (e.g., '6406897160')
  pdfSrc: string | undefined;     // blob url assigned here
  loading = true;
  errorMsg = '';

  async ngAfterViewInit() {
    const id = String(this.url).replace(/"/g, '').trim();
    const pdfUrl = `${environment.baseurl}student/notes/pdf/${id}`;

    try {
      const res = await fetch(pdfUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/pdf',
          // If you need auth: Authorization: `Bearer ${token}`
        },
        // withCredentials: true, // uncomment only if your API requires cookies
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const buf = await res.arrayBuffer();
      const blob = new Blob([buf], { type: 'application/pdf' });
      this.pdfSrc = URL.createObjectURL(blob);
    } catch (e: any) {
      this.errorMsg = `Couldn’t load PDF (${e?.message || 'unknown error'}).`;
      console.error(e);
    } finally {
      this.loading = false;
    }
  }
}
