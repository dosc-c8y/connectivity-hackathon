import { TestBed } from '@angular/core/testing';

import { Lwm2mBulkOperationService } from './lwm2m-bulk-operation.service';

describe('Lwm2mBulkOperationService', () => {
  let service: Lwm2mBulkOperationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Lwm2mBulkOperationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
