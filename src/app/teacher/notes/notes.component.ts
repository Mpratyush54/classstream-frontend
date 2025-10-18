import { Component, inject, Input, OnInit } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { NotesService } from '../services/notes.service';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Type } from '@angular/core';
import { Router } from '@angular/router';
import { DisplayedColumns } from 'src/app/models/table.module/DisplayedColumns';
import { NavigationService } from 'src/app/services/navigation.service';
@Component({
  selector: 'ngbd-modal-content',
  template: `
    <div class="modal-header">
      <h4 class="modal-title">Hi there!</h4>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <p> {{name}}</p>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-outline-dark" (click)="check()" >Close</button>
    </div>
  `
})
export class NgbdModalContent {
  @Input() name;


  constructor(public activeModal: NgbActiveModal, private Routes: Router) { }
  check() {
    if (this.name === 'Your Notes were added sucessfully') {


      this.Routes.navigateByUrl('/teacher/notes')
    } else {


    }
    this.activeModal.close('Close click')

  }
}

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css'],
  standalone: false
})
export class NotesComponent implements OnInit {
isloading:boolean;

  constructor(private service: NotesService, private modalService: NgbModal, private Routes: Router
  ) { }
  displayedColumns: DisplayedColumns[] = [
    {
      displayName: "notes ID",
      type: "Text",
      key: 'id'
    },
    {
      displayName: "Chapter Name",
      type: "Text",
      key: 'ChapterName'
    },
    {
      displayName: "Chapter No",
      type: "Number",
      key: 'chapterno'
    },
    {
      displayName: "date/time",
      type: "Date",
      key: 'date'
    },
    {
      displayName: "Class",
      type: "Number",
      key: 'class'
    },
    {
      key: 'actions',
      displayName: 'Actions',
      type: 'Buttons',
      buttons: [
        { label: 'Edit', color: '#4CAF50', textColor:'#fff', icon: 'edit', action: 'edit' },
        { label: 'Delete', color: '#F44336',textColor:'#fff', icon: 'delete', action: 'delete' },
      ],
    },

  ]
  meassage: any
  meassagenot: boolean = false
  model


  handleButtonClick(event: { action: string; row: any }) {
    switch (event.action) {
      case 'edit':
        this.edit(event.row.id);   // ✅ Pass row.id
        break;
      case 'delete':
        this.delete(event.row.id); // ✅ Pass row.id
        break;
      default:
        console.warn('Unknown action:', event.action);
    }
  }
  ngOnInit(): void {

    this.loadall()
  }
  loaddata() {
    this.isloading =true;
    document.getElementById('datee')
    this.service.fetch_primary().subscribe((res) => {
      if (res) {

        if (res.status == true) {

          if (res.error == false) {


            if (Array.isArray(res.mes) && res.mes.length <= 0) {
              this.meassage = 'No records Found'
            } else {


              this.meassagenot = true

              this.model = res.mes
    this.isloading =false;

            }

          }
        }
      }
    })
  }
  loadall() {
    // console.log(true);

    this.service.fetch_all().subscribe((res) => {
      if (res) {

        if (res.status == true) {

          if (res.error == false) {


            if (Array.isArray(res.mes) && res.mes.length <= 0) {
              this.meassage = 'No records Found'
            } else {


              this.meassagenot = true

              this.model = res.mes
              // console.log(this.model);

            }

          }
        }
      }
    })
  }
  navigateurl(data) {
    this.Routes.navigateByUrl(data)
  }
  edit(data) {
    // console.log(data);

  }
  delete(data) {

    this.service.delete(data).subscribe((res) => {
      if (res) {
        if (res.status) {
          if (res.status == true) {
            if (res.error == false) {
              // 
              const modalRef = this.modalService.open(NgbdModalContent);
              modalRef.componentInstance.name = `The Note was deleted sucessfully with id ${data}`;
              this.loaddata()
            }
          }
        }
      }

    })
  }
}
