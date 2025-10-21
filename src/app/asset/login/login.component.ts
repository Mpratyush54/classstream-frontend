import { AfterViewInit, Component, OnInit, Renderer2 } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone:true,
  imports:[
    CommonModule,
    FormsModule
  ]
})
export class LoginComponent implements OnInit,AfterViewInit  {

  constructor(private service :LoginService,private Routes:Router,private renderer: Renderer2) { }

  ngOnInit(): void {
  }
  onSubmit(data){
    
    event.preventDefault();
  
  
  var statuss = data["username"];
   var change = data["password"];
   
  
   this.service.verifyusernamepass(statuss, change).subscribe((res)=>{
     
  });
  
  
  
     
  }
  navigate(data){
    this.Routes.navigateByUrl(data)
  }
  
   ngAfterViewInit(): void {
    this.generateStars(1000); // density
  }

  private generateStars(count: number): void {
    const container = document.getElementById('star-container');
    if (!container) return;

    for (let i = 0; i < count; i++) {
      const star = this.renderer.createElement('div');
      this.renderer.addClass(star, 'star');

      // Random size and position
      const size = Math.random() * 2.5 + 0.5;
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      const twinkleDuration = 1.5 + Math.random() * 2;
      const delay = Math.random() * 3;

      this.renderer.setStyle(star, 'width', `${size}px`);
      this.renderer.setStyle(star, 'height', `${size}px`);
      this.renderer.setStyle(star, 'left', `${x}px`);
      this.renderer.setStyle(star, 'top', `${y}px`);
      this.renderer.setStyle(star, 'animationDuration', `${twinkleDuration}s`);
      this.renderer.setStyle(star, 'animationDelay', `${delay}s`);

      // ~15% stars drift slowly
      if (Math.random() < 0.15) {
        this.renderer.addClass(star, 'move');
        const driftSpeed = 40 + Math.random() * 80; // 40–120 s
        this.renderer.setStyle(star, 'animationDuration', `${twinkleDuration}s, ${driftSpeed}s`);
      }

      this.renderer.appendChild(container, star);
    }
  }


}
