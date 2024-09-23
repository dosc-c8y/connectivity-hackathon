import { Injectable } from '@angular/core';
import { gettext, NavigatorNode, NavigatorNodeFactory } from '@c8y/ngx-components';
import { Lwm2mMicroserviceGuard } from '../guards';

@Injectable()
export class LWM2MBulkRegFactory implements NavigatorNodeFactory {
  node = new NavigatorNode({
    label: gettext('LWM2M Configuration'),
    path: 'lwm2m-configuration',
    icon: 'terminal',
    parent: {
      label: gettext('Device types'),
      icon: 'c8y-device-protocols'
    },
    priority: 0
  });

  constructor(private guard: Lwm2mMicroserviceGuard) {}

  get() {
    return this.guard.canActivate() ? this.node : [];
  }
}
