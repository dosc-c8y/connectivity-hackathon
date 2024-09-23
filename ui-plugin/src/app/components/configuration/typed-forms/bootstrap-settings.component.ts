import { Component } from '@angular/core';
import { CoreModule, gettext } from '@c8y/ngx-components';
import { Lwm2mUIThemeModule } from '../../../formly';
import { BootstrapSettings, Endpoint } from '../../../model';
import { Lwm2mFormWrapperBase } from './form-wrapper-base.component';
import { Lwm2mConfigurationService } from '../../../services';

@Component({
  templateUrl: './form-wrapper-base.component.html',
  imports: [CoreModule, Lwm2mUIThemeModule],
  standalone: true
})
export class Lwm2mFormBootstrapSettings extends Lwm2mFormWrapperBase<BootstrapSettings> {
  protected endpoint: Endpoint = Endpoint.bootstrap;
  constructor(protected service: Lwm2mConfigurationService<BootstrapSettings>) {
    super(service);
  }

  createForm() {
    return [
      {
        fieldGroup: [
          {
            key: 'bootstrapServerId',
            type: 'number',
            props: {
              label: gettext('Bootstrap Server ID'),
              placeholder: '1',
              min: 0
            }
          },
          {
            key: 'securityInstanceOffset',
            type: 'number',
            props: {
              label: gettext('Security Instance Offset'),
              placeholder: '1',
              min: 0
            }
          }
        ]
      }
    ];
  }
}
