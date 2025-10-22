import { Component, OnInit } from '@angular/core';
import { NotesServiceStudent } from '../../service/notes.service';
import { Router, Routes } from '@angular/router';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
  standalone:false
})
export class IndexComponentnotes implements OnInit {
  textmodel:any
  pdfmodel:any

  constructor(private service : NotesServiceStudent , private Routes:Router) { }

  ngOnInit(): void {
    this.service.index().subscribe((res)=>{
      // console.log(res);
      
this.textmodel =  res.notes  
this.pdfmodel =  res.pdf  
      
    })
  }
navigatetoid(id){
this.Routes.navigateByUrl(`student/notes/${id}`)
}
  formatDate(value: any): string {
    const d = new Date(value);
    return isNaN(d.getTime()) ? String(value ?? '') : d.toLocaleDateString();
  }
}
