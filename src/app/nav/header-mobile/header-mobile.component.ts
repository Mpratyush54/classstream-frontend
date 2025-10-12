import { CommonModule } from '@angular/common';
import { Component, computed, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
// import  * as $  from 'jquery';
import { Router } from '@angular/router';
import { MenuItem } from 'src/app/models/MenuItem';
import { NavigationService } from 'src/app/services/navigation.service';
import { NotificationMapService } from 'src/app/services/notification-map.service';

// Define MenuItem type or import it from its module


@Component({
  selector: 'app-header-mobile',
  templateUrl: './header-mobile.component.html',
  styleUrls: ['./header-mobile.component.css'],
  standalone:true,
  imports:[
    CommonModule
  ]
})
export class HeaderMobileComponent implements OnInit {
notificationService = inject(NotificationMapService);

  constructor(private Routes:Router) { }

  ngOnInit(): void {
    console.log(this.menuService.pillNavItems())
  }
 menuService = inject(NavigationService);
  private sanitizer = inject(DomSanitizer);

  onNavItemClick(item: MenuItem) {
    console.log(item.url == 'more');
    
    if (item.url.toLowerCase() === 'more') { 
      this.menuService.showMobileMenu.set(true); 
    } else { 
      this.menuService.navigate(item.url); 
    }
  }
  onMenuItemClick(url: string) {
    this.menuService.navigate(url);
      this.menuService.showMobileMenu.set(false); 
  }
  getSafeHtml(svg: string) { return this.sanitizer.bypassSecurityTrustHtml(svg); }

}
