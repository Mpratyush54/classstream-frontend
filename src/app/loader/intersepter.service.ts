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
  constructor(private LoaderService:LoaderService , private service:TypeService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const shouldSkip = this.excludedUrls.some((url) => req.url.includes(url));

    if (!shouldSkip) {
      this.LoaderService.Isloading.next(true);
    }


    return next.handle(req).pipe(finalize(()=>{
    
      setTimeout(() => {
        this.LoaderService.Isloading.next(false)
      }, 100);
    }) , )
  }
}

