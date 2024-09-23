import { TestBed } from '@angular/core/testing';
import { CoreModule } from '@c8y/ngx-components';
import { Lwm2mConfigurationService } from '../services';
import { of, throwError } from 'rxjs';
import { Lwm2mBootstrapParametersApiGuard } from './bootstrap-parameters-api.guard';
import { Entity } from '../model';

describe('Lwm2m bootstrap parameters api guard', () => {
  let guard: Lwm2mBootstrapParametersApiGuard;
  let service: Lwm2mConfigurationService<Entity>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreModule.forRoot()],
      providers: [Lwm2mBootstrapParametersApiGuard]
    }).compileComponents();

    guard = TestBed.inject(Lwm2mBootstrapParametersApiGuard);
    service = TestBed.inject(Lwm2mConfigurationService<Entity>);
  });

  test('guard should exist', () => {
    expect(guard).toBeDefined();
  });

  test('bootstrap-parameters tab is not activated when configuration api is available', done => {
    jest.spyOn(service, 'fetchServerCertificates$').mockImplementation(() => of([]));

    guard.canActivate().subscribe(data => {
      expect(data).toBe(false);
      done();
    });
  });

  test('bootstrap-parameters tab is not activated when agent throws an error code other than 404', done => {
    jest
      .spyOn(service, 'fetchServerCertificates$')
      .mockImplementation(() => throwError({ res: { status: 502 } }));

    guard.canActivate().subscribe(data => {
      expect(data).toBe(false);
      done();
    });
  });

  test('Not found (404) will activate bootstrap parameters tab', done => {
    jest
      .spyOn(service, 'fetchServerCertificates$')
      .mockImplementation(() => throwError({ res: { status: 404 } }));

    guard.canActivate().subscribe(data => {
      expect(data).toBe(true);
      done();
    });
  });
});
