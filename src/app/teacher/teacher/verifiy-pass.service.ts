
import { Injectable } from '@angular/core';

import { HttpClient , HttpEventType } from '@angular/common/http';
import * as Rx from "rxjs/Rx";
import { from, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import  * as $  from 'jquery'
import { Router  } from '@angular/router';
import { environment } from '../../../environments/environment';
import { StogageService } from 'src/app/services/stogage.service';
@Injectable({
  providedIn: 'root'
})
export class VerifiyPassService {

  constructor(private http:HttpClient ,private Routes:Router ,private localstorage :StogageService) { }
private get usernames(): string {
    try { return this.localstorage.teacher_get('teacher_username') ?? ''; } catch { return ''; }
  }
  private get emails(): string {
    try { return this.localstorage.teacher_get('teacher_email') ?? ''; } catch { return ''; }
  }
  private get query_tokens(): string {
    try { return this.localstorage.teacher_get('teacher_query_token') ?? ''; } catch { return ''; }
  }
  check_data(id){

      let url = environment.baseurl+`teacher/data-check/${id}`;
     return this.http.post(url ,{
      username:this.usernames,
      email:this.emails ,
      query_token: this.query_tokens
    
      }).pipe(
        map((data: any) => {

          
  if(data.status == true && data.error == false){
  
    return data
  }
  
        }), catchError( response => {
  console.log(response);
  

    
    
        return throwError( 'Something went wrong!' );
         
  
  
        
        })
     )
  }
  verify_data(id){


    let url = environment.baseurl+`teacher/upload-data/verify-upload`;
   return this.http.post(url ,{
    username:this.usernames,
    email:this.emails ,
    query_token: this.query_tokens,
  id:id
    }).pipe(
      map((data: any) => {

        
if(data.status == true){

  return data
}

      }), catchError( response => {
console.log(response);


  
  
      return throwError( 'Something went wrong!' );
       


      
      })
   )
}
}
