import { Component, OnInit } from '@angular/core';
import { StudentVideoService } from '../../service/student-video.service';
import { NgForm } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
  standalone:false
})
export class IndexComponentvieo implements OnInit {

  constructor(private service:StudentVideoService , private Routes:Router) { }
  meassage = ''
  meassagenot = ''
  data:any
  url:any
  ngOnInit(): void {
  this.url = environment.baseurl+'student/video/poseter'
this.service.playvideo().subscribe((res)=>{

  // console.log(res.error);
  
  if(res.status == true){
    if(res.error == false){
      
  this.data =  res.process
  
    }  else{
// console.log('faldse');

    }
  }  
})
  }
  navigatebyurlvideo(id:number){
    
    const data =  `student/play/${id}`
    
    this.Routes.navigateByUrl(data)

  }
navigatebyurl(data){
  // console.log(data);
  
// this.Routes.navigateByUrl(data)
}
  formatDate(value: any): string {
    const d = new Date(value);
    return isNaN(d.getTime()) ? String(value ?? '') : d.toLocaleDateString();
  }
}
