import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MenuItem } from 'src/app/models/MenuItem';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
  selector: 'app-menu-sidebar',
  templateUrl: './menu-sidebar.component.html',
  styleUrls: ['./menu-sidebar.component.css'],
  standalone:true
})
export class MenuSidebarComponent implements OnInit {
 menuService = inject(NavigationService);

  constructor(private Routes:Router,private sanitizer:DomSanitizer) {
      
   }
 
  ngOnInit(): void {
console.log(this.menuService.activeItem());

  }
  
  onNavItemClick(item: MenuItem) {
    console.log(item.name);
    console.log(this.menuService.activeItem());
    
      this.menuService.navigate(item.url);  
  }
  getSafeHtml(svg: string) {
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }
  teacherroute(data){
    this.Routes.navigateByUrl(data);
    
}
}
