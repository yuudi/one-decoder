import { type ComponentFixture, TestBed } from '@angular/core/testing';

import { Encoder } from './encoder';

describe('Encoder', () => {
  let component: Encoder;
  let fixture: ComponentFixture<Encoder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Encoder],
    }).compileComponents();

    fixture = TestBed.createComponent(Encoder);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
