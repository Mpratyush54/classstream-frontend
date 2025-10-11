import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpEventType } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { StogageService } from 'src/app/services/stogage.service';
import { DeviceDetectorService ,DeviceInfo} from 'ngx-device-detector';
import { Observable, throwError } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class NotifcationService {
  deviceInfo:DeviceInfo;

  constructor(private http:HttpClient ,private Routes:Router ,private localstorage :StogageService , private DeviceDetectorService : DeviceDetectorService) { }
   usernames = this.localstorage.student_get('student_username')  
  emails =  this.localstorage.student_get('student_email') 
    query_tokens = this.localstorage.student_get('student_query_token')  
  know_class(username){

               
    
    
        let url = environment.baseurl+`teacher/notification/know_class`;
    
        return this.http.post(url ,{
        username:this.usernames,
       email:this.emails  ,
          query_token: this.query_tokens ,
          data:username
          }).pipe(
            map((data: any) => {
           
        if(data.status == true)   {
          if(data.error == false){  
  return data        
          }
        }   
        
            }), catchError( response => {
    
              return response
    
            
            }))
        

  }
  notification_see(data){

               
    
    
        let url = environment.baseurl+`teacher/notification/check-notifaction-custom2`;
    
        return this.http.post(url ,{
        username:this.usernames,
       email:this.emails  ,
          query_token: this.query_tokens ,
          data:data
          }).pipe(
            map((data: any) => {
           
        if(data.status == true)   {
          if(data.error == false){  
  return data        
          }
        }   
        
            }), catchError( response => {
    
              return response
    
            
            }))
    
  }
  notification(datas:any){

               
    
    
        let url = environment.baseurl+`teacher/notification/data`; 
this.deviceInfo = this.DeviceDetectorService.getDeviceInfo()
console.log(this.DeviceDetectorService.getDeviceInfo());

        return this.http.post(url ,{
        username:this.usernames,
       email:this.emails  ,
          query_token: this.query_tokens ,
          data: datas,
          useragent:this.DeviceDetectorService.getDeviceInfo()

        
          }).pipe(
            map((data: any) => {
           
        if(data.status == true)   {
          if(data.error == false){  
                      this.localstorage.student_refgestration(true)
          }
        }   
        
            }), catchError( response => {
    
              return response
    
            
            }))
    
  }
  notification_student(datas:any){

               
    
    
    let url = environment.baseurl+`teacher/notification/data`; 
this.deviceInfo = this.DeviceDetectorService.getDeviceInfo()
console.log(this.DeviceDetectorService.getDeviceInfo());

    return this.http.post(url ,{
    username:this.usernames,
   email:this.emails  ,
      query_token: this.query_tokens ,
      data: datas,
      userAgents:this.DeviceDetectorService.getDeviceInfo()

    
      }).pipe(
        map((data: any) => {
       
    if(data.status == true)   {
      if(data.error == false){  
                  this.localstorage.student_refgestration(true)
      }
    }   
    
        }), catchError( response => {

          return response

        
        }))

}
    notificationno(){
      

               
  
  
      let url = environment.baseurl+`teacher/notification/check-notifaction-all`;
  
      return this.http.post(url ,{
      username:this.usernames,
     email:this.emails  ,
        query_token: this.query_tokens 
      
        }).pipe(
          map((data: any) => {
         
      if(data.status == true)   {
        if(data.error == false){
      localStorage.setItem('lastroutetime' , data.time)
  
          if(data.notify){
      
            var count = Object.keys(data.notify).length;
      return count
      
          }
        }
      }   
      
          }), catchError( response => {
  
            return response
  
          
          }))
  
    }
    notificationall(){
          let url = environment.baseurl+`teacher/notification/check-notifaction-all`;
        console.log(this.usernames);
        console.log(this.emails);
        console.log(this.query_tokens);
        
          return this.http.post(url ,{
          username:this.usernames,
         email:this.emails  ,
            query_token: this.query_tokens 
          
            }).pipe(
              map((data: any) => {
             console.log(data);
             
          if(data.status == true)   {
            if(data.error == false){
  
              if(data.notify){
          
          return data.notify
          
              }
            }else{
              return []
            }
          }   
          
              }), catchError( response => {
      
                return response
      
              
              }))
      
        }
        onclick(id){
      
  
        
          
          
              let url = environment.baseurl+`teacher/notification/seen`;
          
              return this.http.post(url ,{
      username:this.usernames,
         email:this.emails  ,
            query_token: this.query_tokens ,
                id: id
              
                }).pipe(
                  map((data: any) => {
             
  
              if(data.status == true)   {
                if(data.error == false){
                                 return data

                }
              }   
              
                  }), catchError( response => {
          
                    return response
          
                  
                  }))
          
            }
            notification_send(data){
              

               
              
              
                  let url = environment.baseurl+`teacher/notification/new`;
              
                  return this.http.post(url ,{
          username:this.usernames,
             email:this.emails  ,
                query_token: this.query_tokens ,
  data:data                
                    }).pipe(
                      map((data: any) => {
                 
      
                  if(data.status == true)   {
                    if(data.error == false){
                 return data
                    }
                  }   
                  
                      }), catchError( response => {
              
                        return response
              
                      
                      }))
              
            }
            notification_custom(){
              

               
              
              
                  let url = environment.baseurl+`teacher/notification/check-notifaction-custom`;
              
                  return this.http.post(url ,{
          username:this.usernames,
             email:this.emails  ,
                query_token: this.query_tokens ,
                    }).pipe(
                      map((data: any) => {
                 
  
                  if(data.status == true)   {
                    if(data.error == false){
                 return data
                    }
                  }   
                  
                      }), catchError( response => {
              
                        return response
              
                      
                      }))
              
            }

   routes(url){
    this.Routes.navigateByUrl(url)
  
  }
}
