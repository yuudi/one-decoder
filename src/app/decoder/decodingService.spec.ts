import { TestBed } from '@angular/core/testing';

import { DecodingService } from './decodingService';

describe('Decoding', () => {
  let service: DecodingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DecodingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
