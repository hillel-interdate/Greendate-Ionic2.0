import { TestBed } from '@angular/core/testing';

import { MyvarsService } from './myvars.service';

describe('MyvarsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MyvarsService = TestBed.get(MyvarsService);
    expect(service).toBeTruthy();
  });
});
