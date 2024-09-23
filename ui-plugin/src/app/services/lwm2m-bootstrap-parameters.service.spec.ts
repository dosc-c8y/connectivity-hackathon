import { TestBed } from '@angular/core/testing';
import { FetchClient } from '@c8y/client';
import { omit } from 'lodash-es';
import { Lwm2mBootstrapParameters } from '../model';
import { Lwm2mBootstrapParametersService } from './lwm2m-bootstrap-parameters.service';

describe('Lwm2mBootstrapParametersService', () => {
  let data: Lwm2mBootstrapParameters;
  let service: Lwm2mBootstrapParametersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: FetchClient, useValue: {} }]
    });

    service = TestBed.inject(Lwm2mBootstrapParametersService);
    data = {
      id: '1',
      bootstrapId: '1',
      serverUri: 'coap://test'
    };
  });

  it('service should exist', () => {
    expect(service).toBeDefined();
  });

  describe('Overridden helper methods:', () => {
    it('onBeforeUpdate should remove the id', () => {
      // given
      // const data

      // when
      const params = service.onBeforeUpdate(data);

      // then
      expect(params).toEqual(omit(data, 'id'));
    });

    it('getDetailUrl should construct the correct url', () => {
      // given
      // const data

      // when
      const url = service.getDetailUrl(data);

      // then
      expect(url).toBe(`device/${data.id}/bootstrapParams`);
    });
  });
});
