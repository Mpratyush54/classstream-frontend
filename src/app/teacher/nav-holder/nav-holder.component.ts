import { Component, HostListener, inject, signal } from '@angular/core';
import { NavigationService } from 'src/app/services/navigation.service';
import { AppRoutingModule } from "src/app/app-routing.module";
import { HeaderDesktopComponent } from 'src/app/nav/header-desktop/header-desktop.component';
import { MenuSidebarComponent } from 'src/app/nav/menu-sidebar/menu-sidebar.component';
import { HeaderMobileComponent } from 'src/app/nav/header-mobile/header-mobile.component';
import { MenuItemsComponent } from 'src/app/asset/menu-items/menu-items.component';
import { SearchComponent } from 'src/app/asset/search/search.component';
import { RouterModule } from '@angular/router';
import { NotificationComponent } from '../notification/notification.component';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-nav-holder',
  templateUrl: './nav-holder.component.html',
  styleUrl: './nav-holder.component.css',
  standalone:true,
  imports:[
      HeaderDesktopComponent,
    MenuSidebarComponent,
    HeaderMobileComponent,
    SearchComponent,
    MenuItemsComponent,
    RouterModule,
    // NotificationComponent
  ]
})
export class NavHolderComponent {
  menuService = inject(NavigationService);
  notifiactionnumber:number
notifiactionall
constructor(private notification:NotificationService){
  
      this.notification.notificationno().subscribe((res: any) => {
      console.log(res)
      if (res == undefined) {
        
        this.notifiactionnumber = 0
      } else {
        document.getElementById('notification').removeAttribute('style')

        this.notifiactionnumber = res

      }

    })
    this.notification.notificationall().subscribe((res: any) => {
      console.log(res)


      this.notifiactionall = res


    })

}

}
