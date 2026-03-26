import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectPreviewComponent } from './subject-preview-component';

describe('SubjectPreviewComponent', () => {
  let component: SubjectPreviewComponent;
  let fixture: ComponentFixture<SubjectPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubjectPreviewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SubjectPreviewComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
