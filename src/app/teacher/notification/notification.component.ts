import { Component, OnInit } from '@angular/core';
import {  Router } from '@angular/router';
import { NotificationService } from '../services/notification.service';
import { DisplayedColumns } from 'src/app/models/table.module/DisplayedColumns';
import { TablesComponent } from 'src/app/asset/tables/tables.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css'],
  standalone:true,
  imports:[
    TablesComponent,
    CommonModule
  ]
})
export class NotificationComponent implements OnInit {

  constructor(private Routes : Router , private service:NotificationService ) { }
  displayedColumns: DisplayedColumns[] = [
      {
        displayName: "name of sender",
        type: "Text",
        key: 'by'
      },
      {
        displayName: "date",
        type: "Text",
        key: 'date'
      },
      {
        displayName: "heading",
        type: "Number",
        key: 'heading'
      },
    
     {
        displayName: "heading",
        type: "Number",
        key: 'sttus_seen_time'
      },
    
      {
        key: 'actions',
        displayName: 'Actions',
        type: 'Buttons',
        buttons: [
          { label: 'View Detailed Information', color: 'primary', icon: 'play_circle', action: 'navigateurls',key: 'sttus_seen_time' },
        ],
      },
  
    ]
  handleButtonClick(event: { action: string; row: any }) {
    console.log(event);
    
    switch (event.action) {
      case 'navigateurls':
        this.navigateurls(event.row.sttus_seen_time);   // ✅ Pass row.id
        break;
        
      default:
        console.warn('Unknown action:', event.action);
    }
  }

  model;
  ngOnInit(): void {
    this.service.notification_custom().subscribe((res)=>{
   
      
this.model = res.mes
        })
  }
  navigateurl(data){
    this.Routes.navigateByUrl(data)
   }
   navigateurls(data){
     
    this.Routes.navigateByUrl(`/teacher/notification/${data}`)
   }
}
