import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailPolicyComponent } from './email-policy.component';

describe('EmailPolicyComponent', () => {
  let component: EmailPolicyComponent;
  let fixture: ComponentFixture<EmailPolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailPolicyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
