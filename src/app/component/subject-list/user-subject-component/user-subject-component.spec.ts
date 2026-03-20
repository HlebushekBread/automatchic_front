import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSubjectComponent } from './user-subject-component';

describe('UserSubjectComponent', () => {
  let component: UserSubjectComponent;
  let fixture: ComponentFixture<UserSubjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserSubjectComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UserSubjectComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
