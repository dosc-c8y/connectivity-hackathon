import { TestBed } from '@angular/core/testing';
import { CoreModule, TenantUiService } from '@c8y/ngx-components';
import { Lwm2mMicroserviceGuard } from '../guards';

describe('Lwm2m microservice guard', () => {
  let guard: Lwm2mMicroserviceGuard;
  let tenantService: TenantUiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreModule.forRoot()],
      providers: [Lwm2mMicroserviceGuard]
    }).compileComponents();

    guard = TestBed.inject(Lwm2mMicroserviceGuard);
    tenantService = TestBed.inject(TenantUiService);
  });

  test('guard should exist', () => {
    expect(guard).toBeDefined();
  });

  test('should display tab for devices where microservice is subscribed', () => {
    // given
    jest.spyOn(tenantService, 'isMicroserviceSubscribedInCurrentTenant').mockReturnValue(true);

    // when
    // then
    expect(guard.canActivate()).toBe(true);
  });

  test('should not display tab when microservice is not subscribed', () => {
    // given
    jest.spyOn(tenantService, 'isMicroserviceSubscribedInCurrentTenant').mockReturnValue(false);

    // when
    // then
    expect(guard.canActivate()).toBe(false);
  });
});
