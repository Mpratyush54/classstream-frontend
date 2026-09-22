import { ApplicationRef, HostListener, inject, signal } from '@angular/core';
import { Component, OnInit } from '@angular/core';

import { interval } from 'rxjs';
import { StogageService } from 'src/app/services/stogage.service';
import { NotesService } from '../services/notes.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MenuSidebarComponent } from "src/app/nav/menu-sidebar/menu-sidebar.component";
import { HeaderMobileComponent } from "src/app/nav/header-mobile/header-mobile.component";
import { NavigationService } from 'src/app/services/navigation.service';
import { SearchComponent } from 'src/app/asset/search/search.component';
import { MenuItemsComponent } from 'src/app/asset/menu-items/menu-items.component';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
 
  standalone:true,
   imports: [
    CommonModule,
    RouterLink,
],
})
export class IndexComponent implements OnInit {

  name = '';
  videoCount = 0;
  notesCount = 0;
  loadError: string | null = null;

  constructor(private localstoragee: StogageService, private service: NotesService) {


  }
  ngOnInit(): void {
    try {
      this.name = this.localstoragee.teacher_get('teacher_name') || this.localstoragee.teacher_get('teacher_username') || '';
    } catch { this.name = ''; }

    this.service.check().subscribe({
      next: () => { },
      error: (err) => { this.loadError = err?.message || 'Session check failed'; }
    });

    // Dashboard counts — failures should not blank the page
    this.service.fetch_all().subscribe({
      next: (res: any) => {
        const list = res?.mes || res?.fields || [];
        if (Array.isArray(list)) this.notesCount = list.length;
      },
      error: () => { }
    });
  }
}
