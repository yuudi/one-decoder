import { type ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalLink } from './external-link';

describe('ExternalLink', () => {
  let component: ExternalLink;
  let fixture: ComponentFixture<ExternalLink>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExternalLink],
    }).compileComponents();

    fixture = TestBed.createComponent(ExternalLink);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
