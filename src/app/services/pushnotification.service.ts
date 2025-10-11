import { Injectable } from '@angular/core';
import { delay, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PushnotificationService {
      private readonly publicKey = 'BL1k4svygg7piYjqcY8MH8XW7QAt5T9QU20hWn9wQgLgw6zgVpOOHYmGza1kknjWuc1S-rkkKKazzqGBXpEEWzU';

    // This is a simulation of Angular's SwPush service
    private swPush = {
        isEnabled: 'serviceWorker' in navigator && 'PushManager' in window,
        requestSubscription: (options: { serverPublicKey: string }) => {
            console.log('Requesting push subscription with key:', options.serverPublicKey);
            return Promise.resolve({ toJSON: () => ({ endpoint: 'simulated-endpoint', keys: { p256dh: 'simulated-key', auth: 'simulated-auth' } }) });
        }
    };

    init() {
        if (!this.swPush.isEnabled) {
          console.log('Push Notifications are not enabled on this browser.');
          return;
        }
        
        // Simulate checking if we already registered
        const isRegistered = localStorage.getItem('pushSubscriptionRegistered');
        if (isRegistered) {
          console.log('Push notification subscription already exists.');
          return;
        }

        console.log('Attempting to subscribe to push notifications...');
        this.swPush.requestSubscription({ serverPublicKey: this.publicKey })
            .then(sub => {
                console.log('Successfully subscribed:', sub);
                // Simulate sending the subscription to the backend
                this.sendSubscriptionToBackend(sub).subscribe(res => {
                    console.log('Backend response to subscription:', res);
                    localStorage.setItem('pushSubscriptionRegistered', 'true');
                });
            })
            .catch(err => console.error('Could not subscribe to notifications', err));
    }

    private sendSubscriptionToBackend(sub: any) {
        console.log('Sending subscription to simulated backend...');
        // Simulate an HTTP POST request
        return of({ success: true, message: 'Subscription saved' }).pipe(delay(500));
    }
}
