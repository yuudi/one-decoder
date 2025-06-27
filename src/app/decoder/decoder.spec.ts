import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Decoder } from './decoder';

describe('Decoder', () => {
  let component: Decoder;
  let fixture: ComponentFixture<Decoder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Decoder],
    }).compileComponents();

    fixture = TestBed.createComponent(Decoder);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
