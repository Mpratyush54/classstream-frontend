import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { Router  } from '@angular/router';
import { environment } from '../../../environments/environment';
import { StogageService } from 'src/app/services/stogage.service';

@Injectable({
  providedIn: 'root'
})
export class NotesService {

  constructor(private http: HttpClient, private Routes: Router,private localstorage :StogageService) { }
  // teacher/notes
  json = 'Server faild to respond . Please report us at <a> link</a>'
  // Lazily read credentials — constructor snapshot goes stale after login
  private get usernames(): string {
    try { return this.localstorage.teacher_get('teacher_username') ?? ''; } catch { return ''; }
  }
  private get emails(): string {
    try { return this.localstorage.teacher_get('teacher_email') ?? ''; } catch { return ''; }
  }
  private get query_tokens(): string {
    try { return this.localstorage.teacher_get('teacher_query_token') ?? ''; } catch { return ''; }
  }


  videos_without_file(data){
console.log(data);


 

    let url = environment.baseurl+`teacher/notes`;
    return this.http.post(url ,{
      username:this.usernames,
      email:this.emails ,
      query_token: this.query_tokens,
      Chapter_Name :data.Chapter_Name,
      Chapter_No   :data.Chapter_No,
      Title        : data.Title,
  
      subject : data.subject,
      text    : data.text,
      Manually: data.Manually,
      Class   :data.class,
    }).pipe(
      map((data: any) => {
        // console.log('connection made');

        
 if(data.status == true){

  if(data.error == false){
    return data
  }

        }
    
    
    
      }), catchError( error => {
        console.log(error);
        
if(error.message == `Http failure response for ${url}: 0 Unknown Error`){
return this.json
  
}else{
  return throwError(error.message || "Server Error")
    
     
}

    
      
      }))
  }

  check(){

    
    
     
    
        let url = environment.baseurl+`teacher/login-verify`;
        return this.http.post(url ,{
          username:this.usernames,
          email:this.emails ,
          query_token: this.query_tokens,
         
        }).pipe(
          map((data: any) => {
            // console.log('connection made');
    
            
     if(data.status == true){
    
      if(data.error == false){
        return data
      }
    
            }
        
        
        
          }), catchError( error => {
            console.log(error);
            
    if(error.message == `Http failure response for ${url}: 0 Unknown Error`){
    return this.json
      
    }else{
      return throwError(error.message || "Server Error")
        
         
    }
    
        
          
          }))
      }
    
  videos_with_file(data , file){
console.log( this.usernames);
console.log(this.emails );
console.log(this.query_tokens );



    var jsontoken:any = Math.floor(Math.random() * 10000000000) + 1 
    
    var fd = new FormData()


    fd.append('username' , this.usernames  )
    fd.append('email' , this.emails  )
    fd.append('query_token' , this.query_tokens  )

    fd.append('Chapter_Name' , data.Chapter_Name  )
    fd.append('Chapter_No' , data.Chapter_No  )
    fd.append('Title' , data.Title  )
    fd.append('subject' , data.subject  )
    fd.append('Manually' ,data.Manually  )
    fd.append('Class' ,data.class  )
    fd.append('jsontoken' , jsontoken)
  fd.append('file' , file , file.name )

    let url = environment.baseurl+`teacher/notes/file`;
    
    return this.http.post(url , fd ,{
      reportProgress:true,
      observe:'events'
    }).pipe(
      map((data: any) => {
        // console.log('connection made');

   if(data.type === HttpEventType.Response){
      
      
  return data.body
    }
    
    
    
      }), catchError( error => {
        console.log(error);
        
if(error.message == `Http failure response for ${url}: 0 Unknown Error`){
return this.json
  
}else{
  return  throwError(error.message || "Server Error")
    

}

    
      
      }))
  }
  fetch_primary(){



    let url = environment.baseurl+`teacher/notes_fetch`;
    
    return this.http.post(url ,{
      username:this.usernames,
      email:this.emails ,
      query_token: this.query_tokens,
    }).pipe(
      map((data: any) => {
        // console.log('connection made');

      
      
  return data
    
    
    
    
      }), catchError( error => {
        console.log(error);
        
if(error.message == `Http failure response for ${url}: 0 Unknown Error`){
return this.json
  
}else{
  return throwError(error.message || "Server Error")
    

}

    
      
      }))
  }

  fetch_all(){




    let url = environment.baseurl+`teacher/notes_fetch`;
    
    return this.http.post(url ,{
      username:this.usernames,
      email:this.emails ,
      query_token: this.query_tokens,
      all:true
    }).pipe(
      map((data: any) => {
        // console.log('connection made');

      
      
  return data
    
    
    
    
      }), catchError( error => {
        console.log(error);
        
if(error.message == `Http failure response for ${url}: 0 Unknown Error`){
return this.json
  
}else{
  return throwError(error.message || "Server Error")
    

}

    
      
      }))
  }
  
  delete(id){





    let url = environment.baseurl+`teacher/notes_manage/delete`;
    
    return this.http.post(url ,{
      username:this.usernames,
      email:this.emails ,
      query_token: this.query_tokens,
id:id
    }).pipe(
      map((data: any) => {

    return data

      
    
    
    
    
      }), catchError( error => {
        console.log(error);
        
if(error.message == `Http failure response for ${url}: 0 Unknown Error`){
return this.json
  
}else{
  return throwError(error.message || "Server Error")
    

}

    
      
      }))
  }
}
