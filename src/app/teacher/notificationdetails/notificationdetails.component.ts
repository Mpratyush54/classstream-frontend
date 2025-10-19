import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../services/notification.service';
import { DisplayedColumns } from 'src/app/models/table.module/DisplayedColumns';

@Component({
  selector: 'app-notificationdetails',
  templateUrl: './notificationdetails.component.html',
  styleUrls: ['./notificationdetails.component.css'],
  standalone:false
})
export class NotificationdetailsComponent implements OnInit {
  IsLoading:boolean;
  constructor(private Routes : Router , private service:NotificationService ,private route: ActivatedRoute) { }
  model;
  id1;

    displayedColumns: DisplayedColumns[] = [
        {
          displayName: "Username",
          type: "Text",
          key: 'username'
        },
        {
          displayName: "Class",
          type: "Text",
          key: 'class'
        },
        {
          displayName: "date",
          type: "Date",
          key: 'date'
        },
         {
          displayName: "time",
          type: "DateTime",
          key: 'time'
        },
  
    
      ]
  ngOnInit(): void {
    this.IsLoading= true
    this.id1 = this.route.snapshot.params['id'];

    this.service.notification_see(this.route.snapshot.params['id']).subscribe((res)=>{
if(res)      {
  if(res.mes){
      this.model = res.mes
     
   this.knowclass(res.mes)
}}
      })
  
  }

  navigateurl(data){
    this.Routes.navigateByUrl(data)
   }
   knowclass(res){
     
    for (let i = 0; i < res.length; i++) {

      this.service.know_class(res[i].username).subscribe((response)=>{
          this.model[i].class = response.mes[0].class
       })
     }
    
    this.IsLoading= true

   }
}
