import { Injectable } from '@angular/core';
import { Lwm2mClientService } from '../services';
import { ActivatedRouteSnapshot } from '@angular/router';
import { IIdentified } from '@c8y/client';

@Injectable({
  providedIn: 'root'
})
export class Lwm2mDeviceTypeGuard {
  constructor(private lwm2mClientService: Lwm2mClientService<IIdentified>) {}
  canActivate(route: ActivatedRouteSnapshot) {
    return this.lwm2mClientService.isLwm2mDevice(
      route?.data?.contextData || route?.parent?.data?.contextData
    );
  }
}
