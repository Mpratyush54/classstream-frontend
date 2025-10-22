import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HavHolderComponent } from './hav-holder.component';

describe('HavHolderComponent', () => {
  let component: HavHolderComponent;
  let fixture: ComponentFixture<HavHolderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HavHolderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HavHolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
