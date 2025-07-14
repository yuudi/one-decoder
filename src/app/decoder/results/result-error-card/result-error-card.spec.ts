import { type ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultErrorCard } from './result-error-card';

describe('ResultErrorCard', () => {
  let component: ResultErrorCard;
  let fixture: ComponentFixture<ResultErrorCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultErrorCard],
    }).compileComponents();

    fixture = TestBed.createComponent(ResultErrorCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
