import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { StogageService } from '../services/stogage.service';
import { TypeService } from '../services/type.service';
import { LoaderService } from './loader.service';

@Injectable({
  providedIn: 'root'
})

export class IntersepterService implements HttpInterceptor {
  private excludedUrls: string[] = [
    '/notification/check-notifaction-all',
    '/login-verify',
    '/video/heartbeat',
    '/ping',
  ];
  private pending = 0;
  constructor(private LoaderService:LoaderService , private service:TypeService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const shouldSkip = this.excludedUrls.some((url) => req.url.includes(url));

    if (!shouldSkip) {
      this.pending++;
      this.LoaderService.Isloading.next(true);
    }


    return next.handle(req).pipe(finalize(()=>{
      if (shouldSkip) return;
      this.pending = Math.max(0, this.pending - 1);
      // No setTimeout — the old 100ms delay made every hit feel 1-2s slow with flicker
      if (this.pending === 0) {
        this.LoaderService.Isloading.next(false);
      }
    }) , )
  }
}

