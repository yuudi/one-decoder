import { type ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultSuccessCard } from './result-success-card';

describe('ResultSuccessCard', () => {
  let component: ResultSuccessCard;
  let fixture: ComponentFixture<ResultSuccessCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultSuccessCard],
    }).compileComponents();

    fixture = TestBed.createComponent(ResultSuccessCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
