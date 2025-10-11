import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SwPush } from '@angular/service-worker';
import { LoaderService } from 'src/app/loader/loader.service';
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


}
