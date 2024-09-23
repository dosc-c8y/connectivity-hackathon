import { Injectable } from '@angular/core';
import { Lwm2mConfigurationService } from '../services';
import { map } from 'rxjs/operators';
import { Lwm2mConfigurationApiGuard } from './configuration-api.guard';

@Injectable({
  providedIn: 'root'
})
export class Lwm2mBootstrapParametersApiGuard extends Lwm2mConfigurationApiGuard {
  constructor(protected lwm2mConfigService: Lwm2mConfigurationService) {
    super(lwm2mConfigService);
  }
  canActivate() {
    return super.canActivate().pipe(map(data => !data));
  }
}
