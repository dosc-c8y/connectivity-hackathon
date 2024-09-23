import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot } from '@angular/router';
import { CoreModule } from '@c8y/ngx-components';
import { c8y_lwm2m } from '../model';
import { Lwm2mDeviceTypeGuard } from './device-type.guard';

interface Lwm2mManagedObjectTest {
  c8y_IsLwm2mDevice?: object;
  c8y_DeviceTypes?: string[];
  type?: string;
}

describe('Lwm2m device type guard', () => {
  let guard: Lwm2mDeviceTypeGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreModule.forRoot()],
      providers: [Lwm2mDeviceTypeGuard]
    }).compileComponents();

    guard = TestBed.inject(Lwm2mDeviceTypeGuard);
  });

  test('guard should exist', () => {
    expect(guard).toBeDefined();
  });

  test(`should not display tab for devices with no valid "${c8y_lwm2m}" type marker in contextData`, () => {
    expect(
      canActivate({ type: 'c8y_test', c8y_IsLwm2mDevice: undefined, c8y_DeviceTypes: [] })
    ).toBe(false);
  });

  test(`should display tab for devices with correct c8y_IsLwm2mDevice in contextData`, () => {
    expect(canActivate({ c8y_IsLwm2mDevice: {} })).toBe(true);
  });

  test(`should display tab for devices with correct device type in c8y_DeviceTypes in contextData`, () => {
    expect(canActivate({ c8y_DeviceTypes: ['c8y_test', c8y_lwm2m] })).toBe(true);
  });

  test(`should display tab for devices with correct type in contextData`, () => {
    expect(canActivate({ type: c8y_lwm2m })).toBe(true);
  });

  function canActivate(contextData: Lwm2mManagedObjectTest): boolean {
    const { type, c8y_IsLwm2mDevice, c8y_DeviceTypes } = contextData;

    return guard.canActivate({
      data: {
        contextData: {
          type: type || undefined,
          c8y_IsLwm2mDevice: c8y_IsLwm2mDevice || undefined,
          c8y_DeviceTypes: c8y_DeviceTypes || []
        }
      }
    } as unknown as ActivatedRouteSnapshot);
  }
});
