import { Component, HostListener, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
  selector: 'app-search',
  imports: [],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
 menuService = inject(NavigationService);
  private sanitizer = inject(DomSanitizer);
  getSafeHtml(svg: string) { return this.sanitizer.bypassSecurityTrustHtml(svg); 
}
 @HostListener('window:keydown.escape', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (this.menuService.showSearchOverlay()) {
      this.menuService.closeSearch();
    }
  }

constructor(){
      window.addEventListener('popstate', () => {
 if (this.menuService.showSearchOverlay()) {
      this.menuService.closeSearch();
    }
    });
}
}
