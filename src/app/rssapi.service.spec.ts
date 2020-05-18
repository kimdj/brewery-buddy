import { TestBed } from '@angular/core/testing';

import { RSSApiService } from './rssapi.service';

describe('RSSApiService', () => {
  let service: RSSApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RSSApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
