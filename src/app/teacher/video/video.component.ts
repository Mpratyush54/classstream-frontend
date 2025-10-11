import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router ,ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { VideofetchService } from '../services/videofetch.service';
import { CommonModule } from '@angular/common';
import { HeaderDesktopComponent } from 'src/app/nav/header-desktop/header-desktop.component';
import { MenuSidebarComponent } from 'src/app/nav/menu-sidebar/menu-sidebar.component';
import { HeaderMobileComponent } from 'src/app/nav/header-mobile/header-mobile.component';


@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css'],
  standalone:true,
  imports:[
    CommonModule, // modules it uses

  ]
})
export class VideoComponent implements OnInit {
  model: any;
  model2: any;
  meassage: string;
  meassagenot: boolean;
  image_url: string;
  constructor(private service : VideofetchService ,private Routes: Router , private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.image_url =environment.baseurl+'teacher/playvideo/poster/'

    this.service.playvideo().subscribe((res)=>{
   
      if(Array.isArray(res.process) && res.process.length <= 0 && Array.isArray(res.processed) && res.processed.length <= 0 ){
        this.meassage = 'No records Found'
      }else{
      
this.meassagenot=true

        this.model = res.processed 
        this.model2 = res.process
      }

    })
  }
  playvideo(data){
    event.preventDefault();
this.Routes.navigateByUrl(`teacher/videos/play/${data}`)
  
    }
    navigate(data){
      this.Routes.navigateByUrl(data)
    }
    onSubmit(id){

if (confirm('Are you sure you want to process the video ? It may take a some time depending upon length of the video.')) {
  // Save it!
  this.service.processvideo(id).subscribe((res)=>{
   


  })
} else {
  // Do nothing!
}
    }
}
