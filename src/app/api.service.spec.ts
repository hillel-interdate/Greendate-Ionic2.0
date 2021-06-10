import { TestBed } from '@angular/core/testing';

import { ApiQuery } from './api.service';

describe('ApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApiQuery = TestBed.get(ApiQuery);
    expect(service).toBeTruthy();
  });
});
