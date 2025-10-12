import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  showDesktopPanel = signal(false);
  toggleDesktopPanel() {
     this.showDesktopPanel.set(!this.showDesktopPanel()); 
    }
  closeDesktopPanel() { 
    this.showDesktopPanel.set(false); 
  }
}
