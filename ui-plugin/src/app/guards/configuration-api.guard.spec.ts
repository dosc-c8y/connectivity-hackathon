import { TestBed } from '@angular/core/testing';
import { CoreModule } from '@c8y/ngx-components';
import { Lwm2mConfigurationApiGuard } from './configuration-api.guard';
import { Lwm2mConfigurationService } from '../services';
import { of, throwError } from 'rxjs';

describe('Lwm2m configuration api guard', () => {
  let guard: Lwm2mConfigurationApiGuard;
  let service: Lwm2mConfigurationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreModule.forRoot()],
      providers: [Lwm2mConfigurationApiGuard]
    }).compileComponents();

    guard = TestBed.inject(Lwm2mConfigurationApiGuard);
    service = TestBed.inject(Lwm2mConfigurationService);
  });

  test('guard should exist', () => {
    expect(guard).toBeDefined();
  });

  test('configuration tab gets activated when api returns value', done => {
    jest.spyOn(service, 'fetchServerCertificates$').mockImplementation(() => of([]));

    guard.canActivate().subscribe(data => {
      expect(data).toBe(true);
      done();
    });
  });

  test('configuration tab gets activated when api throws any error but 404', done => {
    jest
      .spyOn(service, 'fetchServerCertificates$')
      .mockImplementation(() => throwError({ res: { status: 502 } }));

    guard.canActivate().subscribe(data => {
      expect(data).toBe(true);
      done();
    });
  });

  test('Not found (404) will not activate configuration tab', done => {
    jest
      .spyOn(service, 'fetchServerCertificates$')
      .mockImplementation(() => throwError({ res: { status: 404 } }));

    guard.canActivate().subscribe(data => {
      expect(data).toBe(false);
      done();
    });
  });
});
