import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { StogageService } from './stogage.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private http: HttpClient,
    private Routes: Router,
    private localsorage: StogageService
  ) { }

  // Generate device info (for Mongo tracking)
  private getDeviceInfo() {
    const userAgent = navigator.userAgent || '';
    const platform = navigator.platform || 'Unknown';
    const appVersion = navigator.appVersion || 'Unknown';
    const browser = this.detectBrowser(userAgent);
    const deviceName = `${platform} ${browser}`;
    let deviceId = localStorage.getItem('device_id');
    if (!deviceId) {
      deviceId = crypto.randomUUID();
      localStorage.setItem('device_id', deviceId);
    }
    return { deviceId, deviceName, platform, browser, appVersion };
  }

  // Detect browser type (simple regex)
  private detectBrowser(userAgent: string): string {
    if (/chrome|crios|crmo/i.test(userAgent)) return 'Chrome';
    if (/firefox|fxios/i.test(userAgent)) return 'Firefox';
    if (/safari/i.test(userAgent)) return 'Safari';
    if (/edg/i.test(userAgent)) return 'Edge';
    if (/opr\//i.test(userAgent)) return 'Opera';
    return 'Unknown';
  }

  verifyusernamepass(statuss: string, change: string) {
    const url = environment.baseurl + 'login';
    const deviceInfo = this.getDeviceInfo();

    return this.http.post(url, {
      name: statuss,
      password: change,
      deviceId: deviceInfo.deviceId,
      deviceName: deviceInfo.deviceName,
      platform: deviceInfo.platform,
      browser: deviceInfo.browser,
      appVersion: deviceInfo.appVersion
    }).pipe(
      map((data: any) => {

        console.log(data);

        if (data.status == true) {
          if (data.fields == 0) {
            document.getElementById('error')?.removeAttribute('style');
            document.getElementById('error')!.innerHTML = data.premsg;
            document.getElementById('error1')?.removeAttribute('style');
            document.getElementById('error1')!.innerHTML = data.premsg;
          }
          if (data.fields == 1) {
            document.getElementById('error1')?.removeAttribute('style');
            document.getElementById('error1')!.innerHTML = data.premsg;
            document.getElementById('error')!.style.display = "none";
          }
          if (data.fields == 2) {
            document.getElementById('error')?.removeAttribute('style');
            document.getElementById('error')!.innerHTML = data.premsg;
            document.getElementById('error1')!.style.display = "none";
          }
        }

        if (data.error == false) {
          if (data.status == true) {
            if (data.login == true) {

              if (data.role == 2) {
                this.localsorage.teacher_insert(
                  data['username'],
                  data['email'],
                  data['name'],
                  data['query_token'],
                  data['class'],
                  data['query_token2']
                );
                this.Routes.navigate(['teacher']);
                return;
              }

              if (data.role == 1) {
                this.localsorage.Student_insert(
                  data['username'],
                  data['email'],
                  data['name'],
                  data['query_token'],
                  data['class'],
                  data['query_token2']
                );
                this.Routes.navigate(['student']);
                return;
              }

              return;
            } else {
              document.getElementById('hidden')?.removeAttribute('style');
              document.getElementById('hidden_message')!.innerHTML = 'Invaild details';
              return throwError(() => 'Invaild details');
            }
          } else {
            document.getElementById('hidden')?.removeAttribute('style');
            document.getElementById('hidden_message')!.innerHTML = 'Invaild details';
            return throwError(() => 'Invaild details');
          }
        } else {
          if (data.mes == "Banned by school/teacher") {
            document.getElementById('hidden')?.removeAttribute('style');
            document.getElementById('hidden_message')!.innerHTML = data.mes;
            return throwError(() => data.mes);
          } else if (data.mes == 'Invalid Details') {
            document.getElementById('hidden')?.removeAttribute('style');
            document.getElementById('hidden_message')!.innerHTML = data.mes;
          } else {
            document.getElementById('hidden')?.removeAttribute('style');
            document.getElementById('hidden_message')!.innerHTML = 'Something went wrong!';
            return throwError(() => 'Something went wrong!');
          }
        }
      }),
      catchError(response => {
        document.getElementById('hidden')?.removeAttribute('style');
        document.getElementById('hidden_message')!.innerHTML = 'Something went wrong!';
        return throwError(() => 'Something went wrong!');
      })
    );
  }
}
