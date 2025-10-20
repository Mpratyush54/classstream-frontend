import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { StogageService } from 'src/app/services/stogage.service';
@Injectable({
  
  providedIn: 'root'
})
export class VideofetchService {
  model1: any;
  model2: any;

  constructor(private http:HttpClient ,private Routes:Router ,private localstorage :StogageService) { }
private readonly   usernames = this.localstorage.teacher_get('teacher_username')
private readonly   emails = this.localstorage.teacher_get('teacher_email')
private readonly   query_tokens = this.localstorage.teacher_get('teacher_query_token')
  

  sendmessage(video_id:Number , video_class:number){
    this.model1 = video_id
    this.model2 = video_class
    this.Routes.navigate(['/teacher/videos/play'])
    
    
    }
  fectchkey(videoId){
      let headers = new Headers();

        let url = environment.baseurl+'video/issue-key';
       return this.http.post(url ,{
      videoId:videoId,
        username:this.usernames,
      email:this.emails ,
      query_token: this.query_tokens,
      qualities: ['1080p', '720p', '480p'] // request all qualities together
    }).pipe(
          map((data: any) => {
    if(data.status == true){
    
      return data
    }
    
          }), catchError( response => {
    console.log(response);
    
      console.log(this.emails);
      
      
          return throwError( 'Something went wrong!' );
           
    
    
          
          })
       )
    }
    playvideo(){
      let headers = new Headers();

        let url = environment.baseurl+'teacher/videofetch';
       return this.http.post(url ,{
        username:this.usernames,
        email:this.emails ,
        query_token: this.query_tokens
      
        },{
          headers: new HttpHeaders({"Origin" :"http://localhost:4200"})
        }).pipe(
          map((data: any) => {
    if(data.status == true){
    
      return data
    }
    
          }), catchError( response => {
    console.log(response);
    
      console.log(this.emails);
      
      
          return throwError( 'Something went wrong!' );
           
    
    
          
          })
       )
    }
    processvideo(id){
      console.log('true0');
      

      let url = environment.baseurl+'teacher/processvideo';
     return this.http.post(url ,{
      username:this.usernames,
      email:this.emails ,
      query_token: this.query_tokens,
      video_id:id
      }).pipe(
        map((data: any) => {
if(data.status == true && data.error == false){
  let currentUrl = this.Routes.url;
  this.Routes.routeReuseStrategy.shouldReuseRoute = () => false;
  this.Routes.onSameUrlNavigation = 'reload';
  this.Routes.navigate([currentUrl]);


}
  
        }), catchError( response => {
  console.log(response);

    
    
        return throwError( 'Something went wrong!' );
         
  
  
        
        })
     )
    }
}
