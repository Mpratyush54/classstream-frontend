import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AppRoutingModule } from "src/app/app-routing.module";

@Component({
  selector: 'app-nav',
  imports: [    RouterModule,
],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {


    currentYear = new Date().getFullYear();

}
