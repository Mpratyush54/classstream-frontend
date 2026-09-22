import { Component, OnInit } from '@angular/core';
import {Title} from "@angular/platform-browser";
import { StogageService } from 'src/app/services/stogage.service';

@Component({
  selector: 'app-index-student',
  templateUrl: './index-student.component.html',
  styleUrls: ['./index-student.component.css'],
  standalone:false
})
export class IndexStudentComponent implements OnInit {

  name = '';

  constructor(private titleService:Title, private localsotage:StogageService) { }

  ngOnInit(): void {
    try {
      this.name = this.localsotage.student_get('student_name') || this.localsotage.student_get('student_username') || '';
    } catch { this.name = ''; }
    this.titleService.setTitle(`Welcome, ${this.name || 'Student'}`);

  }

}
