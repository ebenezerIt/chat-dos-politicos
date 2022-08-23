import { TestBed } from '@angular/core/testing';

import { FilterStorageService } from './filter-storage.service';

describe('FilterStorageService', () => {
  let service: FilterStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilterStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
