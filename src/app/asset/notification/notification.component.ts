import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SwPush } from '@angular/service-worker';
import { LoaderService } from 'src/app/loader/loader.service';
import { NotificationItem } from 'src/app/models/NotificationItem';
import { NavigationService } from 'src/app/services/navigation.service';
import { NotificationMapService } from 'src/app/services/notification-map.service';
import { StogageService } from 'src/app/services/stogage.service';

@Component({
  selector: 'app-notification',
  imports: [],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css',
  standalone:true,
})
export class NotificationComponent {
notificationService = inject(NotificationMapService);
constructor(){}
menuItems = inject(NavigationService);

onNotificationClick(notification: NotificationItem) {
    this.notificationService.markAsRead(notification.id);
    if (notification.link.startsWith('http')) {
        window.open(notification.link, '_blank');
    } else {
        this.menuItems.navigate(notification.link);
    }
    this.menuItems.closeDesktopPanel();
  }
   goBack() {
    this.menuItems.closeDesktopPanel();
  }
}
