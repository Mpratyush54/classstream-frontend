import { Component } from '@angular/core';

@Component({
  selector: 'app-email-policy',
  imports: [],
  templateUrl: './email-policy.component.html',
  styleUrl: './email-policy.component.css'
})
export class EmailPolicyComponent {
  currentYear = new Date().getFullYear();

}
