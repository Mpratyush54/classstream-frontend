import { Component, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
  selector: 'app-menu-items',
  imports: [],
  templateUrl: './menu-items.component.html',
  styleUrl: './menu-items.component.css'
})
export class MenuItemsComponent {
  menuService = inject(NavigationService);
    private sanitizer = inject(DomSanitizer);
    getSafeHtml(svg: string) { return this.sanitizer.bypassSecurityTrustHtml(svg); }
    onMenuItemClick(url: string) {
        this.menuService.navigate(url);
        this.menuService.closeMobileMenu();
    }
}
