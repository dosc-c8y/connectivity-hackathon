import { TestBed } from '@angular/core/testing';
import { FetchClient, IFetchResponse, IResult, IResultList } from '@c8y/client';
import { Lwm2mConfigurationService } from './lwm2m-configuration.service';
import { Endpoint, Entity, Settings, ValidationType } from '../model';
import { tap } from 'rxjs/operators';
import { TestScheduler } from 'rxjs/testing';
import { of } from 'rxjs';

describe('Lwm2mConfigurationService', () => {
  let service: Lwm2mConfigurationService<Settings>;
  let testScheduler: TestScheduler;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: FetchClient,
          useValue: {}
        }
      ]
    });

    service = TestBed.inject(Lwm2mConfigurationService);
    service.deviceId = '123';

    testScheduler = new TestScheduler((actual, expected) => expect(actual).toEqual(expected));
  });

  test('service should exist', () => {
    expect(service).toBeDefined();
  });

  describe('configuration request url', () => {
    test('with a given endpoint', () => {
      expect(service.getDetailUrl({ endpoint: Endpoint.connectivity })).toBe(
        `device/${service.deviceId}/configuration/${Endpoint.connectivity}`
      );
    });

    test('with a given endpoint, but not server endpoint and id', () => {
      expect(service.getDetailUrl({ endpoint: Endpoint.connectivity, id: '111' })).toBe(
        `device/${service.deviceId}/configuration/${Endpoint.connectivity}`
      );
    });

    test('with a given server endpoint and id', () => {
      const id = '111';
      expect(service.getDetailUrl({ endpoint: Endpoint.servers, id })).toBe(
        `device/${service.deviceId}/configuration/${Endpoint.servers}/${id}`
      );
    });

    test('with an undefined endpoint', () => {
      expect(() => service.getDetailUrl({} as Entity)).toThrow();
    });
  });

  describe('configuration servers', () => {
    let servers: { id: number }[] | [] = [];
    beforeEach(() => {
      service.listServers$ = jest.fn().mockImplementation(() =>
        of({
          data: servers,
          res: {} as IFetchResponse
        } as IResultList<IFetchResponse>)
      );
    });

    test('listServers will feed servers$ stream', () => {
      servers = [{ id: 1 }];
      testScheduler.run(({ cold, expectObservable }) => {
        expectObservable(cold('10ms b', { b: () => service.listServers() }).pipe(tap(fn => fn())));
        expectObservable(service.servers$).toBe('a 9ms b', {
          a: [], // BehaviorSubject initial value
          b: servers
        });
      });
    });
  });

  describe('other settings in configuration tab', () => {
    test('getSettingsFor will feed settings$ stream', () => {
      const data = { endpointId: '1' };
      service.detail$ = jest.fn().mockImplementation(() =>
        of({
          data,
          res: {}
        } as IResult<unknown>)
      );
      testScheduler.run(({ cold, expectObservable }) => {
        expectObservable(
          cold('10ms b', {
            b: () => service.getSettingsFor({ endpoint: Endpoint.deviceSettings })
          }).pipe(tap(fn => fn()))
        );
        expectObservable(service.settings$).toBe('a 9ms b', {
          a: {}, // BehaviorSubject initial value
          b: data
        });
      });
    });

    test('call update functionality for specific configuration, device-settings, /basic', () => {
      const data = { endpointId: '1' };
      service.update$ = jest.fn().mockImplementation(() => of({}));

      testScheduler.run(({ cold, expectObservable }) => {
        expectObservable(
          cold('10ms a', {
            a: () => service.updateConfig(data, Endpoint.deviceSettings)
          }).pipe(tap(fn => fn()))
        );
      });

      expect(jest.spyOn(service, 'update$')).toHaveBeenCalledWith({
        ...data,
        endpoint: Endpoint.deviceSettings
      });
    });
  });

  describe('prepare request', () => {
    test('payload of POST request does not contain key-value pairs only needed for view-logic', () => {
      expect(
        service['onBeforeCreate']({
          id: '123',
          deviceInfo: {},
          endpoint: Endpoint.bootstrap,
          someKey: 1
        } as unknown as Entity)
      ).toEqual({ someKey: 1 });
    });

    test('payload of PUT request does not contain key-value pairs only needed for view-logic', () => {
      expect(
        service['onBeforeUpdate']({
          id: '123',
          deviceInfo: {},
          endpoint: Endpoint.bootstrap,
          someKey: 1
        } as unknown as Entity)
      ).toEqual({ someKey: 1 });
    });
  });

  describe('certificate handling', () => {
    test('validate X509', done => {
      const spy = jest.spyOn(service, 'fetch$');
      spy.mockReturnValue(
        of({ json: () => Promise.resolve({ commonName: 'dev123' }) } as IFetchResponse)
      );
      service.validate('fakeX509Cert', ValidationType.X509).subscribe(data => {
        expect(spy).toBeCalledWith(`device/configuration/${ValidationType.X509}/validate`, {
          method: 'POST',
          headers: { 'content-type': 'application/json', accept: 'application/json' },
          body: JSON.stringify({ encodedCertificate: 'fakeX509Cert' })
        });
        expect(data).toBe('dev123');
        done();
      });
    });

    test('validate private key', done => {
      const spy = jest.spyOn(service, 'fetch$');
      spy.mockReturnValue(
        of({ json: () => Promise.resolve({ fingerprint: 'AFingerprint' }) } as IFetchResponse)
      );
      service.validate('fakePrivateKey', ValidationType.PRIVATE_KEY).subscribe(data => {
        expect(spy).toBeCalledWith(`device/configuration/${ValidationType.PRIVATE_KEY}/validate`, {
          method: 'POST',
          headers: { 'content-type': 'application/json', accept: 'application/json' },
          body: JSON.stringify({ encodedPrivateKey: 'fakePrivateKey' })
        });
        expect(data).toBe('AFingerprint');
        done();
      });
    });

    test('file read as data url is transformed into a string accepted by the api', () => {
      const testString = 'data:application/x-x509-ca-cert;base64,LS0tLS1CR';
      const expectedString = 'LS0tLS1CR';
      expect(service.cleanUpBase64Data(testString)).toBe(expectedString);
    });

    test('file is not base64 encoded', () => {
      const testString = 'data:some-malformedStr,LS0tLS1CR';
      expect(service.cleanUpBase64Data(testString)).toBeUndefined();
    });
  });
});
