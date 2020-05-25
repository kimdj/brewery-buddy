import { TestBed } from '@angular/core/testing';

import { GeoloctionService } from './geoloction.service';

describe('GeoloctionService', () => {
  let service: GeoloctionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeoloctionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
