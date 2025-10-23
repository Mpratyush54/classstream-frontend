import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoPlayerHlsComponent } from './video.player.hls.component';

describe('VideoPlayerHlsComponent', () => {
  let component: VideoPlayerHlsComponent;
  let fixture: ComponentFixture<VideoPlayerHlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoPlayerHlsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoPlayerHlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
