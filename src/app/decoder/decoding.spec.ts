import { TestBed } from '@angular/core/testing';

import { Decoding } from './decoding';

describe('Decoding', () => {
  let service: Decoding;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Decoding);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
