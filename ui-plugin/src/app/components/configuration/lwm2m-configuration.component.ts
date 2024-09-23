import { Component } from '@angular/core';
import { Endpoint, Settings } from '../../model';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Lwm2mConfigurationService } from '../../services';
import { Lwm2mUIThemeModule } from '../../formly';
import { CdkTreeModule } from '@angular/cdk/tree';
import { CoreModule, Tab, gettext } from '@c8y/ngx-components';
import { IIdentified } from '@c8y/client';
import { Lwm2mFormWrapperBase } from './typed-forms';

@Component({
  selector: 'c8y-lwm2m-configuration',
  templateUrl: './lwm2m-configuration.component.html',
  imports: [CoreModule, Lwm2mUIThemeModule, CdkTreeModule, RouterModule],
  standalone: true
})
export class Lwm2mConfigurationComponent {
  tabs: Tab[];
  componentInstance: Lwm2mFormWrapperBase<Settings>;

  constructor(
    private lwm2mConfigService: Lwm2mConfigurationService<IIdentified>,
    private route: ActivatedRoute
  ) {
    this.lwm2mConfigService.deviceId = this.route?.snapshot?.parent?.params?.['id'];

    this.tabs = [
      {
        icon: 'cog',
        label: gettext('Device settings'),
        path: this.getPath(Endpoint.deviceSettings)
      },
      {
        icon: 'connected',
        label: gettext('Connectivity'),
        path: this.getPath(Endpoint.connectivity)
      },
      {
        icon: 'c8y-firmware',
        label: gettext('Firmware update'),
        path: this.getPath(Endpoint.firmware)
      },
      {
        icon: 'root-server',
        label: gettext('Bootstrap'),
        path: this.getPath(Endpoint.bootstrap)
      },
      {
        icon: 'stack',
        label: gettext('Servers written during bootstrap'),
        path: this.getPath(Endpoint.servers)
      }
    ];
  }

  onActivate(event: Lwm2mFormWrapperBase<Settings>) {
    this.componentInstance = event;
  }

  private getPath(endpoint: Endpoint) {
    const { deviceId } = this.lwm2mConfigService;
    return `/device/${deviceId}/lwm2m-configuration/${endpoint}`;
  }
}
