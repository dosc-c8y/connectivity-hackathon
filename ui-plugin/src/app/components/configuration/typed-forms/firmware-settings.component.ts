import { Component } from '@angular/core';
import { CoreModule, gettext } from '@c8y/ngx-components';
import { Lwm2mUIThemeModule } from '../../../formly';
import {
  Endpoint,
  FWU_DeliveryMethod,
  FWU_ResetMechanism,
  FWU_SupportedDeviceProtocol,
  FirmwareSettings
} from '../../../model';
import { Lwm2mFormWrapperBase } from './form-wrapper-base.component';
import { Lwm2mConfigurationService } from '../../../services';

@Component({
  templateUrl: './form-wrapper-base.component.html',
  imports: [CoreModule, Lwm2mUIThemeModule],
  standalone: true
})
export class Lwm2mFormFirmwareSettings extends Lwm2mFormWrapperBase<FirmwareSettings> {
  protected endpoint = Endpoint.firmware;
  constructor(protected service: Lwm2mConfigurationService<FirmwareSettings>) {
    super(service);
  }

  createForm() {
    const selects = [
      {
        key: 'deliveryMethod',
        label: gettext('Update delivery method'),
        _enum: FWU_DeliveryMethod
      },
      {
        key: 'supportedDeviceProtocol',
        label: gettext('Update supported device protocol'),
        _enum: FWU_SupportedDeviceProtocol
      },
      {
        key: 'reset',
        label: gettext('Update reset mechanism'),
        _enum: FWU_ResetMechanism
      }
    ];
    return [
      {
        wrappers: ['legend'],
        fieldGroup: [
          {
            key: 'url',
            type: 'string',
            props: {
              label: gettext('Update URL'),
              placeholder: 'firmware-image-url',
              description: gettext('If not specified, LWM2M Agent generates the URL')
            }
          },
          {
            key: 'resetStateMachineOnStart',
            type: 'switch',
            defaultValue: false,
            props: {
              label: gettext('Reset state machine'),
              description: gettext(
                'Controls if the LWM2M Agent performs an initial state machine reset before it starts a firmware update'
              )
            }
          },
          ...selects.map(select => ({
            key: select.key,
            type: 'select',
            defaultValue: Object.values(select._enum)[0],
            props: {
              label: select.label,
              options: Object.values(select._enum).map(value => ({ label: value, value }))
            }
          }))
        ]
      }
    ];
  }
}
