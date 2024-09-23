import { Component } from '@angular/core';
import { CoreModule, gettext } from '@c8y/ngx-components';
import { Lwm2mUIThemeModule } from '../../../formly';
import { ConnectivitySettings, Endpoint, Mode } from '../../../model';
import { Lwm2mFormWrapperBase } from './form-wrapper-base.component';
import { Lwm2mConfigurationService } from '../../../services';

@Component({
  templateUrl: './form-wrapper-base.component.html',
  imports: [CoreModule, Lwm2mUIThemeModule],
  standalone: true
})
export class Lwm2mFormConnectivitySettings extends Lwm2mFormWrapperBase<ConnectivitySettings> {
  protected endpoint: Endpoint = Endpoint.connectivity;
  constructor(protected service: Lwm2mConfigurationService<ConnectivitySettings>) {
    super(service);
  }

  createForm() {
    const DISABLED = 'DISABLED';
    const selects = [
      {
        key: 'bootstrapConnectivity',
        label: gettext('Bootstrap server authentication')
      },
      {
        key: 'serverConnectivity',
        label: gettext('Server authentication')
      }
    ];

    return [
      {
        fieldGroup: [
          ...selects.map(select => ({
            key: select.key,
            wrappers: ['legend'],
            props: {
              label: select.label
            },
            fieldGroup: [
              {
                type: '#securityMode',
                props: {
                  options: [
                    { label: DISABLED, value: DISABLED },
                    ...Object.values(Mode).map(value => ({ label: value, value }))
                  ]
                }
              },
              { type: '#pskId' },
              { type: '#pskKey' }
            ]
          }))
        ]
      }
    ];
  }
}
