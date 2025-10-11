import { computed, inject, Injectable, signal } from '@angular/core';
import { NotificationService } from 'src/app/teacher/services/notification.service';
import { NotificationItem } from '../models/NotificationItem';

@Injectable({
  providedIn: 'root'
})
export class NotificationMapService {
    
    notifications = signal<NotificationItem[]>([]);
    unreadCount = computed(() => this.notifications().filter(n => !n.read).length);
constructor(private apiService:NotificationService){
    if(this.notifications.length == 0 ||!this.notifications  ){
    this.fetchNotifications()

    }
}
    fetchNotifications() {
        console.log('NotificationService: Triggering fetch from ApiService...');
        this.apiService.notificationall().subscribe(apiResponse => {
          console.log(apiResponse);
            const mappedData = apiResponse.map(item => ({
                id: item.id,
                title: item.heading,
                body: item.body,
                link: item.onclick,
                time: `${item.date} at ${item.time}`,
                read: item.status !== 1,
                photo: item.photo,
                username: item.username,
            }));

            this.notifications.set(mappedData);
            console.log('Notifications loaded and mapped.');
        });
    }


    
    markAsRead(id: number) {
        this.apiService.onclick(id).subscribe(data => {
            if (data) {
                this.notifications.update(notifications => 
                    notifications.map(n => n.id === id ? { ...n, read: true } : n)
                );
            }
        });
    }
}
