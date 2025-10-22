import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuItemsComponent } from 'src/app/asset/menu-items/menu-items.component';
import { ProfileComponent } from 'src/app/asset/profile/profile.component';
import { SearchComponent } from 'src/app/asset/search/search.component';
import { HeaderDesktopComponent } from 'src/app/nav/header-desktop/header-desktop.component';
import { HeaderMobileComponent } from 'src/app/nav/header-mobile/header-mobile.component';
import { MenuSidebarComponent } from 'src/app/nav/menu-sidebar/menu-sidebar.component';
import { NavigationService } from 'src/app/services/navigation.service';
import { ProfileService } from 'src/app/services/profile.service';
import { NotificationComponent } from 'src/app/teacher/notification/notification.component';

@Component({
  selector: 'app-hav-holder',
  imports: [
          HeaderDesktopComponent,
    MenuSidebarComponent,
    HeaderMobileComponent,
    SearchComponent,
    MenuItemsComponent,
    RouterModule,
    NotificationComponent,
    ProfileComponent
  ],
  templateUrl: './hav-holder.component.html',
  styleUrl: './hav-holder.component.css',
  standalone:true
})
export class HavHolderComponent {
  menuService = inject(NavigationService);
  ProfileService = inject(ProfileService);

}
