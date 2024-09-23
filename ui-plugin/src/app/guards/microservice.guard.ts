import { Injectable } from '@angular/core';
import { TenantUiService } from '@c8y/ngx-components';
import { agentName } from '../model';

@Injectable({
  providedIn: 'root'
})
export class Lwm2mMicroserviceGuard {
  constructor(private tenantService: TenantUiService) {}

  canActivate() {
    return this.tenantService.isMicroserviceSubscribedInCurrentTenant(agentName);
  }
}
