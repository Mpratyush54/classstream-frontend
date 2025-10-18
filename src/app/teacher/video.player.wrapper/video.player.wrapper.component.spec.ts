import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoPlayerWrapperComponent } from './video.player.wrapper.component';

describe('VideoPlayerWrapperComponent', () => {
  let component: VideoPlayerWrapperComponent;
  let fixture: ComponentFixture<VideoPlayerWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoPlayerWrapperComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoPlayerWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
