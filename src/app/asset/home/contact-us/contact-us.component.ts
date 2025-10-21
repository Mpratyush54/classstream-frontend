import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact-us',
  imports: [FormsModule, CommonModule],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.css'
})
export class ContactUsComponent {
    alertVisible = false;
  alertMessage = '';

  private formURL =
    'https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse'; // replace with your Google Form URL

  constructor(private http: HttpClient) {}

  onSubmit(form: any) {
    const body = new URLSearchParams();
    for (const field in form.value) {
      body.set(field, form.value[field]);
    }

    this.http
      .post(this.formURL, body.toString(), {
        headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }),
        responseType: 'text',
      })
      .subscribe({
        next: () => {
          this.alertMessage = '✅ Message sent successfully!';
          this.showAlert();
          form.resetForm();
        },
        error: () => {
          this.alertMessage = '❌ Something went wrong. Please try again.';
          this.showAlert();
        },
      });
  }

  private showAlert() {
    this.alertVisible = true;
    setTimeout(() => (this.alertVisible = false), 3000);
  }


}
