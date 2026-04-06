import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailConfirmComponent } from './email-confirm-component';

describe('EmailConfirmComponent', () => {
  let component: EmailConfirmComponent;
  let fixture: ComponentFixture<EmailConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailConfirmComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmailConfirmComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
