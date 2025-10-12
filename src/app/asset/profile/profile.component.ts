import { Component, HostListener, inject } from '@angular/core';
import { NavigationService } from 'src/app/services/navigation.service';
import { ProfileService } from 'src/app/services/profile.service';
import { StogageService } from 'src/app/services/stogage.service';
import { LogoutService } from 'src/app/teacher/services/logout.service';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
menuItems = inject(NavigationService);
Logout = inject(LogoutService);
authService = inject(StogageService);
  ProfileService = inject(ProfileService);

  goBack() {
    this.menuItems.navigate('/teacher');
  }
  
  logout() {
    this.Logout.logout();
  }
      @HostListener('window:keydown.escape', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (this.ProfileService.showDesktopPanel()) this.ProfileService.closeDesktopPanel();
  }
constructor(){
      window.addEventListener('popstate', () => {
    if (this.ProfileService.showDesktopPanel()) this.ProfileService.closeDesktopPanel();

    });
}
}
